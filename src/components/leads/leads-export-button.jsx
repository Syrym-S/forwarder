import { useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { api } from "../../app/client";
import PrimaryButton from "../../shared/ui/button/primary-button";
import FormInput from "../../shared/ui/input/form-input";

const getToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Qyzylorda",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const LeadsExportButton = () => {
  const [open, setOpen] = useState(false);
  const [dateTo, setDateTo] = useState(getToday);
  const [dateFrom, setDateFrom] = useState(
    () => `${getToday().slice(0, 4)}-01-01`,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const valid = Boolean(dateFrom && dateTo && dateFrom <= dateTo);

  const download = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/forwarder/v1/reports/leads/export", {
        params: { date_from: dateFrom, date_to: dateTo },
        responseType: "blob",
      });
      const contentType = response.headers["content-type"] || "";
      if (contentType.includes("json")) {
        const data = JSON.parse(await response.data.text());
        throw new Error(data.message || "Сервер не вернул файл экспорта");
      }
      const disposition = response.headers["content-disposition"] || "";
      const encodedName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
      const plainName = disposition.match(
        /filename="([^"]+)"|filename=([^;]+)/i,
      );
      const extension = contentType.includes("csv")
        ? "csv"
        : contentType.includes("pdf")
          ? "pdf"
          : "xlsx";
      let filename =
        plainName?.[1] ??
        plainName?.[2]?.trim() ??
        `leads_${dateFrom}_${dateTo}.${extension}`;
      if (encodedName) {
        try {
          filename = decodeURIComponent(encodedName);
        } catch {
          /* Use the fallback filename. */
        }
      }
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename.replace(/[\\/]/g, "_");
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setOpen(false);
    } catch (failure) {
      let message = failure.message || "Не удалось экспортировать данные";
      if (failure.response?.data instanceof Blob) {
        try {
          message =
            JSON.parse(await failure.response.data.text()).message || message;
        } catch {
          /* Keep the request error. */
        }
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PrimaryButton
        variant="outlined"
        text="Выгрузка данных"
        sx={{
          width: 300,
        }}
        startIcon={<FileDownloadOutlinedIcon />}
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      />
      <Dialog
        open={open}
        onClose={() => {
          if (!loading) setOpen(false);
        }}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: "16px", border: "2px solid #1f1f1f", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)", overflow: "hidden" } } }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1, fontSize: "1.3rem", fontWeight: 700, color: "#263244" }}>Выгрузка истории перевозок</DialogTitle>
        <DialogContent sx={{ px: 3, pt: "6px !important", pb: 1 }}>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>Выберите период для выгрузки данных.</Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 1,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <FormInput
              label="Дата с"
              type="date"
              value={dateFrom}
              disabled={loading}
              onChange={(event) => setDateFrom(event.target.value)}
              fullWidth
              size="small"
            />
            <FormInput
              label="Дата по"
              type="date"
              value={dateTo}
              disabled={loading}
              onChange={(event) => setDateTo(event.target.value)}
              fullWidth
              size="small"
            />
          </Box>
          {dateFrom && dateTo && dateFrom > dateTo && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Дата начала должна быть не позже даты окончания.
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 2, pb: 2.5, gap: 1 }}>
          <PrimaryButton variant="outlined" disabled={loading} onClick={() => setOpen(false)} text="Отмена" />
          <PrimaryButton
            isLoading={loading}
            disabled={!valid}
            onClick={download}
            startIcon={!loading && <FileDownloadOutlinedIcon />}
            text={loading ? "Выгрузка…" : "Скачать"}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LeadsExportButton;
