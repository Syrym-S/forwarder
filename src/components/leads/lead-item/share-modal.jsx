import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const ShareModal = ({
  leadId,
  openShareModal,
  handleCloseShareModal,
  setShareUrl,
}) => {
  const shareLead = useLeadsStore((state) => state.shareLead);

  const handleShareLead = async () => {
    const response = await shareLead(leadId);
    const link = response.url;
    const expires_at = response.expires_at;

    setShareUrl({
      url: link,
      expires_at: expires_at,
    });
  };

  return (
    <Dialog
      open={openShareModal}
      onClose={handleCloseShareModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: "2px solid #1f1f1f",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 1.5,
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "#263244",
        }}
      >
        Поделиться перевозкой
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: 400,
            color: "#667892",
            lineHeight: 1.5,
          }}
        >
          Вы уверены, что хотите поделиться информацией о перевозке с третьими
          лицами? Информация будет доступна по ссылке любому, у кого она есть.
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: 1.5,
            mt: 3.5,
          }}
        >
          <Button
            color="primary"
            onClick={handleCloseShareModal}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              fontSize: "0.8em",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Отмена
          </Button>

          <Button
            color="primary"
            variant="contained"
            onClick={handleShareLead}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              fontSize: "0.8em",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 10px rgba(25, 103, 210, 0.25)",
              "&:hover": {
                boxShadow: "0 5px 12px rgba(25, 103, 210, 0.3)",
              },
            }}
          >
            Поделиться
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
