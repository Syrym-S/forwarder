import { useTranslation } from "react-i18next";
import TooltipIconButton from "../../../shared/ui/tooltip-icon-button";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import FormInput from "../../../shared/ui/input/form-input";
import { StepSection } from "../step-section";
import MobileStepEmptyState from "../mobile-step-empty-state";

const DocumentUpload = ({ setValue, uploadedFiles, setUploadedFiles }) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const UploadContainer = isMobile ? StepSection : Box;
  const { id } = useParams();
  const [fileName, setFileName] = useState(null);
  const [fileContext, setFileContext] = useState(null);

  const files = useLeadsStore((state) => state.files);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const deleteLeadFile = useLeadsStore((state) => state.deleteLeadFile);

  const handleFileName = (event) => {
    setFileName(event.target.value);
  };
  const handleFileContext = (event) => {
    setFileContext(event.target.value);
  };

  const handleDeleteFileFromDB = async (lead_id, file_path) => {
    await deleteLeadFile(lead_id, file_path);
    await getLeadFiles(lead_id);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const parseFile = {
      id: crypto.randomUUID(),
      name: fileName || file.name,
      fileName: file.name,
      context: fileContext || "",
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file?.type,
      webkitRelativePath: file.webkitRelativePath,
      file: file,
    };

    setUploadedFiles((prev) => [...prev, parseFile]);
    setFileName(null);
    setFileContext(null);
    event.target.value = "";
  };

  const handleRemoveFile = (id) => {
    const result = uploadedFiles.filter((file) => file.id !== id);

    setUploadedFiles(result);
  };

  useEffect(() => {
    setValue("documents", uploadedFiles, {
      shouldDirty: true,
    });
  }, [uploadedFiles, setValue]);

  return (
    <UploadContainer
      title={isMobile ? t("ui.documents") : undefined}
      sx={{ display: "grid", gap: 2 }}
    >
      <Stack spacing={2}>
        {isMobile && (
          <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "text.secondary" }}>
            {t("lead_form.mobile_documents_hint")}
          </Typography>
        )}
        <Box
          sx={{
            p: { xs: 1.5, sm: 0 },
            border: { xs: "1px solid", sm: "none" },
            borderColor: "divider",
            borderRadius: { xs: 2, sm: 0 },
            bgcolor: { xs: "background.default", sm: "transparent" },
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 1fr) minmax(0, 1fr) auto",
            },
            gap: { xs: 1.5, sm: 1 },
            alignItems: "flex-start",
          }}
        >
          <FormInput
            label={t("ui.document_name")}
            value={fileName ?? ""}
            size="small"
            onChange={handleFileName}
            fullWidth
          />

          <FormInput
            name="context"
            label={t("ui.description")}
            value={fileContext ?? ""}
            size="small"
            onChange={handleFileContext}
            fullWidth
          />

          <Box>
            <Button
              title={t("ui.choose_file")}
              aria-label={t("ui.choose_file")}
              component="label"
              variant={isMobile ? "contained" : "outlined"}
              startIcon={<UploadFileOutlinedIcon />}
              sx={{
                minHeight: { xs: 48, sm: 40 },
                width: {
                  xs: "100%",
                  md: "auto",
                },
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              {t("ui.choose_file")}
              <input
                name="file"
                type="file"
                hidden
                accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png,.mp4,.mpeg,.mov,.avi,.mkv,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png,video/mp4,video/mpeg,video/quicktime,video/x-msvideo,video/x-matroska"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </Box>

        <Typography
          sx={{
            mt: 0.5,
            fontSize: { xs: 13, sm: 11 },
            fontWeight: { xs: 600, sm: 400 },
            lineHeight: { xs: 1.5, sm: 1.3 },
            color: "text.secondary",
            maxWidth: {
              xs: "100%",
              md: 180,
            },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={t("ui.file")}
        >
          {t("lead_form.files")}
          {isMobile && (
            <Box
              component="span"
              sx={{ ml: 1, px: 0.75, py: 0.25, borderRadius: 1, bgcolor: "action.hover", color: "text.primary", fontSize: 11 }}
            >
              {uploadedFiles.length + (id ? files.length : 0)}
            </Box>
          )}
        </Typography>

        {isMobile && !isLoading && !uploadedFiles.length && (!id || !files.length) && (
          <MobileStepEmptyState
            icon={<InsertDriveFileOutlinedIcon />}
            title={t("lead_form.mobile_documents_empty")}
            description={t("lead_form.mobile_documents_empty_hint")}
            detail="PDF, Excel, JPG, PNG, MP4, MPEG, MOV, AVI, MKV"
          />
        )}

        {isLoading ? (
          <CircularProgress />
        ) : (
          id &&
          files.map((file, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "grey.50",
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{
                    color: "common.white",
                    fontSize: 24,
                  }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.35,
                  }}
                >
                  {file?.name || t("ui.document")}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 1.35,
                  }}
                >
                  {file?.context || t("ui.description_not_specified")}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    fontSize: 11,
                    fontWeight: 400,
                    lineHeight: 1.35,
                    wordBreak: "break-word",
                  }}
                >
                  {file?.fileName || t("ui.file")}
                </Typography>
              </Box>
              {file?.source === "forwarder" && (
                <TooltipIconButton
                  title={t("ui.delete_document")}
                  aria-label={t("ui.delete_document")}
                  size="small"
                  color="error"
                  onClick={() => handleDeleteFileFromDB(id, file.path)}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </TooltipIconButton>
              )}
            </Box>
          ))
        )}

        {uploadedFiles.map((file, index) => (
          <Box
            key={index}
            sx={{
              p: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "grey.50",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <InsertDriveFileOutlinedIcon
                sx={{
                  color: "common.white",
                  fontSize: 24,
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  lineHeight: 1.35,
                }}
              >
                {file?.name || t("ui.document")}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.25,
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: 1.35,
                }}
              >
                {file?.context || t("ui.description_not_specified")}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: 11,
                  fontWeight: 400,
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
              >
                {file?.fileName || t("ui.file")}
              </Typography>
            </Box>
            <TooltipIconButton
              title={t("ui.delete_document")}
              aria-label={t("ui.delete_document")}
              size="small"
              color="error"
              onClick={() => handleRemoveFile(file.id)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </TooltipIconButton>
          </Box>
        ))}
      </Stack>
    </UploadContainer>
  );
};

export default DocumentUpload;
