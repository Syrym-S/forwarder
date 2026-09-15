import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ShareLeadLinkModal = ({ open, link, expiresAt, onClose, onNavigate }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Не удалось скопировать ссылку:", error);
    }
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate();
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
          },
        },
      }}
    >
      <DialogContent
        sx={{
          px: 2.5,
          py: 2.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#1E293B",
            mb: 2,
          }}
        >
          Ссылка на лид
        </Typography>

        <Typography
          sx={{
            fontSize: "14px",
            color: "#64748B",
            mb: 2,
          }}
        >
          Любой, у кого есть эта ссылка, сможет просмотреть информацию о лиде.
        </Typography>

        <TextField
          value={link}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{
            mb: 1.5,

            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "14px",
              color: "#9E9E9E",
            },
          }}
        />

        <Typography
          sx={{
            fontSize: "13px",
            color: "#1E293B",
          }}
        >
          Ссылка действительна до {expiresAt}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            mt: 3,
          }}
        >
          <Button
            onClick={onClose}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1557C9",
            }}
          >
            Закрыть
          </Button>

          <Button
            variant="outlined"
            onClick={handleCopy}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              px: 1.8,
              py: 0.7,

              // Чтобы кнопка не прыгала по ширине при смене текста
              minWidth: "125px",
            }}
          >
            {isCopied ? "Скопировано" : "Скопировать"}
          </Button>
          <Button
            variant="contained"
            onClick={handleNavigate}
            size="small"
            sx={{
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              borderRadius: "8px",
              px: 2,
              py: 0.7,
              backgroundColor: "#1E5EC8",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",

              "&:hover": {
                backgroundColor: "#174FAE",
              },
            }}
          >
            Перейти
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLeadLinkModal;
