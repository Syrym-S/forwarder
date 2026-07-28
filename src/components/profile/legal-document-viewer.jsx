import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useProfileStore } from "../../app/store/profile/profile-store";

const LegalDocumentViewer = ({ file }) => {
  const isLegalDocumentsLoading = useProfileStore(
    (state) => state.isLegalDocumentsLoading,
  );

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if (!file?.content || !file?.mime) {
      setFileUrl(null);
      return undefined;
    }

    try {
      const base64 = file.content.replace(/^data:[^;]+;base64,/, "");

      const binaryString = window.atob(base64);

      const bytes = new Uint8Array(binaryString.length);

      for (let index = 0; index < binaryString.length; index += 1) {
        bytes[index] = binaryString.charCodeAt(index);
      }

      const blob = new Blob([bytes], {
        type: file.mime,
      });

      const url = URL.createObjectURL(blob);

      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Ошибка создания preview:", error);

      setFileUrl(null);

      return undefined;
    }
  }, [file?.content, file?.mime]);

  if (isLegalDocumentsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!file) {
    return <Typography color="text.secondary">Документ не найден</Typography>;
  }

  if (!fileUrl) {
    return (
      <Typography color="text.secondary">Загрузка предпросмотра...</Typography>
    );
  }

  if (file.mime === "application/pdf") {
    return (
      <Box
        component="iframe"
        src={fileUrl}
        title={file.name}
        sx={{
          my: 1,
          width: "100%",
          height: "30vh",
          display: "block",
          border: 0,
          borderRadius: 1,
          boxShadow: 2,
        }}
      />
    );
  }

  return (
    <Typography color="text.secondary">
      Предпросмотр файла типа {file.mime} не поддерживается
    </Typography>
  );
};

export default LegalDocumentViewer;
