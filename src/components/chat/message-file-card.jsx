import { Box, IconButton, Typography } from "@mui/material";
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

const MessageFileCard = ({ file, messageType }) => {
  const { id } = useParams();

  const downloadFile = useLeadsStore((state) => state.downloadMessageFile);

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
        backgroundColor: "action.hover",
        maxWidth: 300,
      }}
    >
      {currentFile.icon}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
          {file?.file_name}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {currentFile.label}
        </Typography>
      </Box>

      <IconButton onClick={handleDownload} size="small">
        <DownloadOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default MessageFileCard;
