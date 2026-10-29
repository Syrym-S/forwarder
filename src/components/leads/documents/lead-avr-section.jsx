import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      setDownloadError(t("ui.document_download_failed_retry"));
    } finally {
      setDownloadingKey(null);
    }
  };
  const busy = isLoading || isGenerating || isSigning;
  const documents = [
    {
      key: "driver",
      title: t("ui.driver_completion_certificate"),
      parties: t("ui.forwarder_and_driver"),
      document: driverDocument?.document,
      signed: driverSigned,
      available: true,
      onSign: onSignDriver,
    },
    {
      key: "customer",
      title: t("ui.customer_completion_certificate"),
      parties: t("ui.forwarder_and_customer"),
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
            >{t("ui.work_completion_certificates")}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
              {readOnly
                ? t("ui.completed_lead_documents")
                : t("ui.completion_certificates_description")}
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
        >{t("ui.refresh_status")}</Button>
      </Stack>

      {!readOnly && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>{t("ui.completion_certificate_signing_order")}</Alert>
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
              ? t("ui.signed")
              : locked
                ? t("ui.next_stage")
                : document
                  ? t("ui.awaiting_signature")
                  : t("ui.not_created");
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
                    label={isLoading ? t("ui.loading") : status}
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
                      >{t("ui.loading_document")}</Typography>
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
                        {document.name || t("ui.work_completion_certificate_avr")}
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
                          ? t("ui.downloading")
                          : t("ui.download_document")}
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
                        ? t("ui.customer_certificate_creation_hint")
                        : readOnly || signed
                          ? t("ui.document_file_unavailable")
                          : t("ui.certificate_not_created_hint")}
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
                          ? t("ui.opening_signing")
                          : t("ui.proceed_to_signing")}
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
                        ? t("ui.creating_certificate")
                        : document
                          ? t("ui.recreate")
                          : t("ui.create_certificate")}
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
