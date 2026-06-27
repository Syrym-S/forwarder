import { Box, IconButton, Typography } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useParams } from "react-router-dom";
import { getFileType } from "../../../shared/helpers/file/get-file-type";
import { ROLES } from "../../../shared/const/roles";

export function LeadDocumentCard({
  isFileReadOnly = false,
  document,
  onOpen,
  onDelete,
  isDeleting = false,
}) {
  const { id } = useParams();
  const fileType = getFileType(document);
  const isForwarderFile = document?.source === ROLES.forwarder;

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen(document)}
      sx={{
        p: 1.5,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1.5,
        backgroundColor: "grey.50",
        textAlign: "left",
        color: "inherit",
        cursor: "pointer",
        transition: "0.2s ease",
        font: "inherit",
        "&:hover": {
          borderColor: "primary.light",
          backgroundColor: "rgba(33, 150, 243, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          gap: 3,
          width: "100%",
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "1fr 3fr 1fr",
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

        <Box>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.35,
            }}
          >
            {document.name || "Документ"}
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
            {document.context || "Описание не указано"}
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
            {document.fileName || "Файл"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            flexShrink: 0,
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {isForwarderFile && !isFileReadOnly && (
            <IconButton
              size="small"
              color="error"
              sx={{
                height: "fit-content",
              }}
              disabled={isDeleting}
              onClick={() => onDelete(id, document.path)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {fileType === "image" && (
        <Box
          component="img"
          title={document.name || "Документ лида"}
          sx={{
            display: "block",
            borderRadius: 2,
            width: "100%",
            border: 0,
            maxWidth: "100%",
            maxHeight: 200,
            objectFit: "contain",
          }}
          src={
            !isForwarderFile
              ? `https://driver.360logistics.kz/wp-content/uploads/${document.path}`
              : document.url
          }
          src={document.url}
        />
      )}

      {fileType === "pdf" && (
        <Box
          component="iframe"
          title={document.name || "Документ лида"}
          sx={{
            display: "block",
            width: "100%",
            border: 0,
            maxWidth: "100%",
            borderRadius: 2,
          }}
          // src={
          //   !isForwarderFile
          //     ? `https://driver.360logistics.kz/wp-content/uploads/${document.path}`
          //     : document.url
          // }
          src={document.url}
        />
      )}
    </Box>
  );
}
