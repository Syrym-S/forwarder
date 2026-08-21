import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const ShareModal = ({ leadId, openShareModal, handleCloseShareModal }) => {
  const shareLead = useLeadsStore((state) => state.shareLead);

  const handleShareLead = async () => {
    const response = await shareLead(leadId);

    window.location(`/shared/${leadId}/${response.token}`);
  };

  return (
    <Dialog
      open={openShareModal}
      onClose={handleCloseShareModal}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Поделиться лидом</DialogTitle>
      <DialogContent>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 400,
            color: "#585858",
          }}
        >
          Вы уверены, что хотите поделиться информацией о лиде с третьими
          лицами? Информация будет доступна по ссылке любому, у кого она есть.
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
            gap: 2,
          }}
        >
          <Button color="primary" onClick={handleCloseShareModal}>
            Отмена
          </Button>
          <Button color="primary" variant="contained" onClick={handleShareLead}>
            Поделиться
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
