import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { renderAsync } from "docx-preview";
import { useProfileStore } from "../../app/store/profile/profile-store";

const LegalDocumentViewer = ({ file }) => {
  const isLegalDocumentsLoading = useProfileStore(
    (state) => state.isLegalDocumentsLoading,
  );

  const [fileUrl, setFileUrl] = useState(null);
  const [fileBlob, setFileBlob] = useState(null);

  const docxContainerRef = useRef(null);

  useEffect(() => {
    if (!file?.content || !file?.mime) {
      setFileUrl(null);
      setFileBlob(null);

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

      setFileBlob(blob);
      setFileUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Ошибка создания preview:", error);

      setFileUrl(null);
      setFileBlob(null);

      return undefined;
    }
  }, [file?.content, file?.mime]);

  useEffect(() => {
    if (
      file?.mime !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      !fileBlob ||
      !docxContainerRef.current
    ) {
      return;
    }

    const renderDocument = async () => {
      try {
        docxContainerRef.current.innerHTML = "";

        await renderAsync(fileBlob, docxContainerRef.current);
      } catch (error) {
        console.error("Ошибка отображения DOCX:", error);
      }
    };

    renderDocument();

    return () => {
      if (docxContainerRef.current) {
        docxContainerRef.current.innerHTML = "";
      }
    };
  }, [file?.mime, fileBlob]);

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

  if (
    file.mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <Box
        ref={docxContainerRef}
        sx={{
          my: 1,
          width: "100%",
          height: "30vh",
          overflow: "auto",
          borderRadius: 1,
          boxShadow: 2,

          "& .docx-wrapper": {
            background: "#f5f5f5",
            padding: 2,
          },

          "& .docx": {
            margin: "0 auto",
          },
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
