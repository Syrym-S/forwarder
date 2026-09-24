import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useParams } from "react-router-dom";

const checkFileFormat = (file) => {
  const fileFormat = file?.split(".");
  const lastElem = fileFormat?.[fileFormat.length - 1]?.toLowerCase();

  if (["jpeg", "jpg", "png", "webp"].includes(lastElem)) {
    return "image";
  }

  if (lastElem === "pdf") {
    return "pdf";
  }

  return "file";
};

const MessageFileCard = ({ file, messageType, isForwarderSend }) => {
  const { id } = useParams();

  const downloadFile = useLeadsStore((state) => state.downloadMessageFile);
  const isDownloadLoading = useLeadsStore((state) => state.isDownloadLoading);
  const downloadingFileId = useLeadsStore((state) => state.downloadingFileId);

  const fileFormat = checkFileFormat(file?.file_name);

  const handleDownload = async () => {
    try {
      const blob = await downloadFile(id, file.id, messageType);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", file?.file_name || "file");

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      console.log(file.id);
    } catch (error) {
      console.error("Ошибка скачивания файла:", error);
    }
  };

  const fileInfo = {
    image: {
      icon: <InsertDriveFileOutlinedIcon />,
      label: "Изображение",
    },
    pdf: {
      icon: <PictureAsPdfOutlinedIcon color="error" />,
      label: "PDF документ",
    },
    file: {
      icon: <InsertDriveFileOutlinedIcon />,
      label: "Документ",
    },
  };

  const currentFile = fileInfo[fileFormat];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: isForwarderSend ? "rgba(255,255,255,0.1)" : "background.default",
        maxWidth: 300,
        minWidth: 0,
        border: "1px solid",
        borderColor: isForwarderSend ? "rgba(255,255,255,0.25)" : "divider",
        color: isForwarderSend ? "common.white" : "primary.main",
      }}
    >
      {currentFile.icon}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          noWrap
          sx={{ fontWeight: 500, color: isForwarderSend ? "white" : "black" }}
        >
          {file?.file_name}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: isForwarderSend ? "white" : "black",
          }}
        >
          {currentFile.label}
        </Typography>
      </Box>

      {isDownloadLoading && downloadingFileId === file.id ? (
        <CircularProgress size={20}
          sx={{
            color: "inherit",
          }}
        />
      ) : (
        <IconButton aria-label={`Скачать ${file?.file_name || "файл"}`} onClick={handleDownload} size="small" sx={{ color: "inherit" }}>
          <DownloadOutlinedIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default MessageFileCard;
