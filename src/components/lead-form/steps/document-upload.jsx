import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const DocumentUpload = ({ setValue, uploadedFiles, setUploadedFiles }) => {
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
  const handleFileContext = () => {
    setFileContext(event.target.value);
  };

  const handleDeleteFileFromDB = async (lead_id, file_path) => {
    await deleteLeadFile(lead_id, file_path);
    await getLeadFiles(lead_id);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    const parseFile = {
      id: crypto.randomUUID(),
      name: fileName || file.name,
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
  };

  const handleRemoveFile = (id) => {
    const result = uploadedFiles.filter((file) => file.id !== id);

    setUploadedFiles(result);
  };

  useEffect(() => {
    setValue("documents", uploadedFiles, {
      shouldDirty: true,
    });
  }, [uploadedFiles]);

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Stack spacing={2}>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr auto",
            },
            gap: 1,
            alignItems: "flex-start",
          }}
        >
          <TextField
            label="Название документа"
            size="small"
            onInput={handleFileName}
            fullWidth
          />

          <TextField
            name="context"
            label="Описание"
            size="small"
            onInput={handleFileContext}
            fullWidth
          />

          <Box>
            <Button
              component="label"
              variant={"outlined"}
              startIcon={<UploadFileOutlinedIcon />}
              sx={{
                minHeight: 40,
                width: {
                  xs: "100%",
                  md: "auto",
                },
              }}
            >
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
            fontSize: 11,
            lineHeight: 1.3,
            color: "text.secondary",
            maxWidth: {
              xs: "100%",
              md: 180,
            },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={"Файл"}
        >
          Файлы
        </Typography>

        {isLoading ? (
          <>...</>
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
                  {file?.name || "Документ"}
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
                  {file?.context || "Описание не указано"}
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
                  {file?.fileName || "Файл"}
                </Typography>
              </Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDeleteFileFromDB(id, file.path)}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
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
                {file?.name || "Документ"}
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
                {file?.context || "Описание не указано"}
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
                {file?.fileName || "Файл"}
              </Typography>
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleRemoveFile(file.id)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default DocumentUpload;
