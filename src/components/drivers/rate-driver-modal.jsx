import { useId, useState } from "react";
import {
  Box,
  Alert,
  FormControlLabel,
  Switch,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const labels = [
  "Выберите оценку",
  "Плохо",
  "Есть замечания",
  "Хорошо",
  "Очень хорошо",
  "Отлично!",
];

const RateDriverModal = ({ onClose, onConfirm, driver }) => {
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const titleId = useId();

  const handleConfirm = async () => {
    if (!rate || isSubmitting || !onConfirm) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm({ rate, comment: comment.trim(), is_visible: isVisible });
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || "Не удалось сохранить оценку");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={isSubmitting ? undefined : onClose}
      aria-labelledby={titleId}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 4, m: 2, width: "100%" } } }}
    >
      <Box
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 3,
          background: "linear-gradient(135deg, #fffaf0, #fff3d6)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DialogTitle
            id={titleId}
            sx={{ p: 0, flex: 1, fontWeight: 700, fontSize: 24 }}
          >
            Оцените водителя
          </DialogTitle>
          <IconButton aria-label="Закрыть" onClick={onClose} disabled={isSubmitting}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography
          color="text.secondary"
          sx={{ mt: 1, overflowWrap: "anywhere" }}
        >
          {driver?.fio || "Водитель"}
        </Typography>
      </Box>

      <DialogContent
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Как прошла работа с водителем?
        </Typography>
        <Typography
          sx={{
            fontSize: "4rem",
            fontWeight: 700,
            lineHeight: 1.2,
            color: rate ? "#b77900" : "text.disabled",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {rate.toFixed(1)}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2.5 }}
        >
          из 5 баллов
        </Typography>
        <Rating
          name="driver-rating"
          disabled={isSubmitting}
          value={rate}
          precision={0.5}
          getLabelText={(value) => `${value} из 5`}
          icon={<StarRoundedIcon fontSize="inherit" />}
          emptyIcon={<StarRoundedIcon fontSize="inherit" />}
          sx={{
            fontSize: { xs: 42, sm: 48 },
            gap: 0.5,
            color: "#f5b31b",
            "& .MuiRating-iconEmpty": { color: "#e8eaf0" },
          }}
          onChange={(_, value) => setRate(value ?? 0)}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, minHeight: 24 }}
        >
          {labels[Math.ceil(rate)]}
        </Typography>
        <TextField
          label="Комментарий"
          disabled={isSubmitting}
          placeholder="Расскажите о работе с водителем"
          helperText="Необязательно"
          multiline
          minRows={3}
          fullWidth
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          sx={{
            mt: 3,
            textAlign: "left",
            "& .MuiOutlinedInput-root": { borderRadius: 3 },
          }}
        />
        <FormControlLabel
          sx={{ mt: 1, alignSelf: "flex-start" }}
          control={<Switch checked={isVisible} disabled={isSubmitting} onChange={(_, checked) => setIsVisible(checked)} />}
          label="Показывать оценку"
        />
        {error && <Alert severity="error" sx={{ mt: 2, width: "100%" }}>{error}</Alert>}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 2.5,
          borderTop: 1,
          borderColor: "divider",
          gap: 1,
          bgcolor: "#fafbfc",
          "& > .MuiButton-root": { flex: 1, py: 1.2 },
        }}
      >
        <Button onClick={onClose} disabled={isSubmitting} color="inherit" sx={{ borderRadius: 2 }}>
          Закрыть
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={rate === 0 || isSubmitting || !onConfirm}
          onClick={handleConfirm}
          sx={{ borderRadius: 2 }}
        >
          {isSubmitting ? "Сохранение…" : "Подтвердить"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateDriverModal;
