import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const LeadAvrSection = ({
  driverDocument,
  customerDocument,
  driverSigned,
  customerSigned,
  readOnly,
  isLoading,
  isGenerating,
  isSigning,
  error,
  onRefresh,
  onGenerate,
  onSignDriver,
  onSignCustomer,
}) => {
  const [downloadingKey, setDownloadingKey] = useState(null);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = async (document, key) => {
    setDownloadingKey(key);
    setDownloadError("");
    try {
      const response = await fetch(document.url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      const urlName = new URL(document.url, window.location.href).pathname
        .split("/")
        .pop();
      link.href = url;
      link.download = document.fileName || urlName || `avr-${key}`;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setDownloadError("Не удалось скачать документ. Попробуйте ещё раз.");
    } finally {
      setDownloadingKey(null);
    }
  };
  const busy = isLoading || isGenerating || isSigning;
  const documents = [
    {
      key: "driver",
      title: "Акт с водителем",
      parties: "Экспедитор и водитель",
      document: driverDocument?.document,
      signed: driverSigned,
      available: true,
      onSign: onSignDriver,
    },
    {
      key: "customer",
      title: "Акт с заказчиком",
      parties: "Экспедитор и заказчик",
      document: customerDocument?.document,
      signed: customerSigned,
      available: Boolean(driverSigned),
      onSign: onSignCustomer,
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={2.5}
      >
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box
            sx={{
              display: "flex",
              p: 1.25,
              borderRadius: 2,
              my: 1,
              bgcolor: "background.main",
              color: "primary.main",
            }}
          >
            <DescriptionOutlinedIcon />
          </Box>
          <Box
            sx={{
              p: 1,
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "font_color.heading",
              }}
            >
              Акты выполненных работ
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
              {readOnly
                ? "Документы по завершённой перевозке"
                : "Создание и подписание актов с водителем и заказчиком"}
            </Typography>
          </Box>
        </Stack>
        <Button
          onClick={onRefresh}
          disabled={busy}
          startIcon={
            isLoading ? <CircularProgress size={16} /> : <RefreshRoundedIcon />
          }
          sx={{ flexShrink: 0, textTransform: "none", borderRadius: 2 }}
        >
          Обновить статус
        </Button>
      </Stack>

      {!readOnly && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          Сначала подпишите акт с водителем, затем — с заказчиком. После
          подписания в новой вкладке нажмите «Обновить статус».
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {downloadError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {downloadError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            md: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
        }}
        aria-busy={Boolean(busy)}
      >
        {documents.map(
          ({ key, title, parties, document, signed, available, onSign }) => {
            const locked = !readOnly && !available && !signed;
            const status = signed
              ? "Подписан"
              : locked
                ? "Следующий этап"
                : document
                  ? "Ожидает подписи"
                  : "Не создан";
            const canAct = !readOnly && available && !signed;

            return (
              <Box
                key={key}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                  bgcolor: "background.default",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={1}
                  flexWrap="wrap"
                >
                  <Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                      {title}
                    </Typography>
                    <Typography
                      sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}
                    >
                      {parties}
                    </Typography>
                  </Box>
                  <Chip
                    label={isLoading ? "Загрузка…" : status}
                    icon={
                      signed ? <CheckCircleOutlineRoundedIcon /> : undefined
                    }
                    color={
                      signed
                        ? "success"
                        : document && !locked
                          ? "primary"
                          : "default"
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      fontSize: 11,
                      fontWeight: 500,
                      bgcolor: "background.paper",
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {isLoading ? (
                    <Stack
                      direction="row"
                      gap={1.5}
                      alignItems="center"
                      role="status"
                    >
                      <CircularProgress size={18} />
                      <Typography
                        sx={{ fontSize: 13, color: "text.secondary" }}
                      >
                        Загружаем документ…
                      </Typography>
                    </Stack>
                  ) : document ? (
                    <>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {document.name || "Акт выполненных работ (AVR)"}
                      </Typography>
                      {document.context && (
                        <Typography
                          sx={{
                            mt: 0.5,
                            fontSize: 12,
                            color: "text.secondary",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {document.context}
                        </Typography>
                      )}
                      <Button
                        size="small"
                        disabled={!document.url || downloadingKey !== null}
                        startIcon={
                          downloadingKey === key ? (
                            <CircularProgress size={16} />
                          ) : (
                            <DownloadRoundedIcon />
                          )
                        }
                        onClick={() => handleDownload(document, key)}
                        sx={{ mt: 1, textTransform: "none" }}
                      >
                        {downloadingKey === key
                          ? "Скачивание…"
                          : "Скачать документ"}
                      </Button>
                    </>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "text.secondary",
                      }}
                    >
                      {locked
                        ? "Создание акта станет доступно после подписания акта с водителем."
                        : readOnly || signed
                          ? "Файл документа пока недоступен. Попробуйте обновить статус."
                          : "Акт ещё не создан. Создайте документ для подписания."}
                    </Typography>
                  )}
                </Box>

                {canAct && (
                  <Stack
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {document && (
                      <Button
                        variant="contained"
                        disableElevation
                        disabled={busy}
                        onClick={onSign}
                        startIcon={
                          isSigning ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : undefined
                        }
                        sx={{ textTransform: "none", borderRadius: 2 }}
                      >
                        {isSigning
                          ? "Открываем подписание…"
                          : "Перейти к подписанию"}
                      </Button>
                    )}
                    <Button
                      variant={document ? "outlined" : "contained"}
                      disableElevation
                      disabled={busy}
                      onClick={onGenerate}
                      startIcon={
                        isGenerating ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : undefined
                      }
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      {isGenerating
                        ? "Создаём акт…"
                        : document
                          ? "Создать заново"
                          : "Создать акт"}
                    </Button>
                  </Stack>
                )}
              </Box>
            );
          },
        )}
      </Box>
    </Paper>
  );
};

export default LeadAvrSection;
