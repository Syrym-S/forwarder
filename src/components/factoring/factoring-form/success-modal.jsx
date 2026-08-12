import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";

const SuccessModal = ({ open, setOpen }) => {
  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Stack alignItems="center" textAlign="center" spacing={2.5}>
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Состояние факторинга
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              В ожидании подтверждения линии
            </Typography>
          </Box>

          <Box
            sx={{
              width: "100%",
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Факторинг можно создать после подтверждения факторинговой линии.
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleClose}
            sx={{
              mt: 1,
              borderRadius: 2,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Ок
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
