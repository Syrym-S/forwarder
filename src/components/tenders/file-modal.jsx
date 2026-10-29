import { useTranslation } from "react-i18next";
import Tooltip from "../../shared/ui/action-tooltip";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React from "react";
import { getFileType } from "../../shared/helpers/file/get-file-type";
import { ROLES } from "../../shared/const/roles";

const FileModal = ({ currentFile, setCurrentFile }) => {
  const { t } = useTranslation();
  const fileType = getFileType(currentFile);
  // const isForwarderFile = currentFile?.source === ROLES.forwarder;

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
                  title={currentFile.name || t("ui.lead_document")}
                  sx={{
                    display: "block",
                    width: "100%",
                    border: 0,
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                  src={
                    // !isForwarderFile
                    //   ? `https://driver.360logistics.kz/wp-content/uploads/${currentFile.path}`
                    //   :
                    currentFile.url
                  }
                />
              )}

              {fileType === "pdf" && (
                <Box
                  component="iframe"
                  title={currentFile.name || t("ui.lead_document")}
                  sx={{
                    display: "block",
                    width: "100%",
                    border: 0,
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                  }}
                  src={
                    // !isForwarderFile
                    //   ? `https://driver.360logistics.kz/wp-content/uploads/${currentFile.path}`
                    //   :
                    currentFile.url
                  }
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
            <Tooltip title={t("ui.open_in_new_tab")}>
              <IconButton
                
                component="a"
                href={currentFile?.url}
                target="_blank"
                rel="noreferrer"
                aria-label={t("ui.open_in_new_tab")}
              >
                <OpenInNewOutlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("ui.download")}>
              <IconButton
                
                component="a"
                href={currentFile?.url}
                download={currentFile?.name || true}
                aria-label={t("ui.download")}
              >
                <DownloadOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Button color="error" variant="outlined" onClick={handleCloseModal}>{t("ui.close")}</Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default FileModal;
