import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React from "react";
import { getFileType } from "../../shared/helpers/file/get-file-type";

const FileModal = ({ currentFile, setCurrentFile }) => {
  const fileType = getFileType(currentFile);

  const handleCloseModal = () => {
    setCurrentFile(null);
  };

  return (
    <Dialog
      open={!!currentFile}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: "1.5rem",
          }}
        >
          {currentFile?.name}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.6rem",
          }}
        >
          {currentFile?.context}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: "90vh", width: "100%" }}>
        <Box
          sx={{
            height: "90%",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "auto",
            backgroundColor: "grey.100",
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          {currentFile && (
            <>
              {fileType === "image" && (
                <Box
                  component="img"
                  title={currentFile.name || "Документ лида"}
                  sx={{
                    display: "block",
                    width: "100%",
                    border: 0,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  src={currentFile.url}
                />
              )}

              {fileType === "pdf" && (
                <Box
                  component="iframe"
                  title={currentFile.name || "Документ лида"}
                  sx={{
                    display: "block",
                    width: "100%",
                    border: 0,
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                  src={currentFile.url}
                />
              )}
            </>
          )}
        </Box>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Tooltip title="Открыть в новой вкладке">
              <IconButton
                component="a"
                href={currentFile?.url}
                target="_blank"
                rel="noreferrer"
                aria-label="Открыть в новой вкладке"
              >
                <OpenInNewOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Скачать">
              <IconButton
                component="a"
                href={currentFile?.url}
                download={currentFile?.name || true}
                aria-label="Скачать"
              >
                <DownloadOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Button color="error" variant="outlined" onClick={handleCloseModal}>
              Закрыть
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default FileModal;
