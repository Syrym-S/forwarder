import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
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

const labels = () => [
  appI18n.t("ui.select_rating"),
  appI18n.t("ui.rating_poor"),
  appI18n.t("ui.rating_needs_improvement"),
  appI18n.t("ui.rating_good"),
  appI18n.t("ui.rating_very_good"),
  appI18n.t("ui.rating_excellent"),
];

const RateDriverModal = ({ onClose, onConfirm, driver }) => {
  const { t } = useTranslation();
  const [rate, setRate] = useState(1);
  const [comment, setComment] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const titleId = useId();

  const handleConfirm = async () => {
    if (rate < 1 || isSubmitting || !onConfirm) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm({ rate, comment: comment.trim(), is_visible: isVisible });
      onClose();
    } catch (e) {
      setError(e.response?.data?.message || t("ui.save_rating_failed"));
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
          >{t("ui.rate_driver")}</DialogTitle>
          <IconButton
            aria-label={t("ui.close")}
            onClick={onClose}
            disabled={isSubmitting}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography
          color="text.secondary"
          sx={{ mt: 1, overflowWrap: "anywhere" }}
        >
          {driver?.fio || t("ui.driver")}
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t("ui.driver_experience_question")}</Typography>
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
        >{t("ui.out_of_five_points_lowercase")}</Typography>
        <Rating
          name="driver-rating"
          disabled={isSubmitting}
          value={rate}
          precision={0.5}
          getLabelText={(value) => t("ui.rating_out_of_five", { value1: value })}
          icon={<StarRoundedIcon fontSize="inherit" />}
          emptyIcon={<StarRoundedIcon fontSize="inherit" />}
          sx={{
            fontSize: { xs: 42, sm: 48 },
            gap: 0.5,
            color: "#f5b31b",
            "& .MuiRating-iconEmpty": { color: "#e8eaf0" },
          }}
          onChange={(_, value) => setRate(Math.max(1, value ?? 1))}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, minHeight: 24 }}
        >
          {labels()[Math.ceil(rate)]}
        </Typography>
        <TextField
          label={t("ui.comment")}
          disabled={isSubmitting}
          placeholder={t("ui.describe_driver_experience")}
          helperText={t("ui.optional")}
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
          control={
            <Switch
              checked={isVisible}
              disabled={isSubmitting}
              onChange={(_, checked) => setIsVisible(checked)}
            />
          }
          label={t("ui.show_rating")}
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
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
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          color="inherit"
          sx={{ borderRadius: 2 }}
        >{t("ui.close")}</Button>
        <Button
          variant="contained"
          disableElevation
          disabled={rate < 1 || isSubmitting || !onConfirm}
          onClick={handleConfirm}
          sx={{ borderRadius: 2 }}
        >
          {isSubmitting ? t("ui.saving") : t("ui.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RateDriverModal;
