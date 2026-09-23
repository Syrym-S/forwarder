import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const WarningModal = ({
  openWarningModal,
  handleCloseShareModal,
  setConfirm,
  comment,
  setComment,
}) => {
  const handleShareLead = async () => {
    setConfirm(true);
  };

  return (
    <Dialog
      open={openWarningModal}
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
        Перенос перевозки в статус "Аварийная ситуация"
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          label="Причина"
          placeholder="Введите комментарий..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: "0.9rem",
            },
          }}
        />

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
            disabled={!comment}
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
            Сообщить об аварии
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;
