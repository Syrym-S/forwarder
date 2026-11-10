import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";
import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import Cropper from "react-easy-crop";
import { cropAvatar } from "../../features/profile-edit/crop-avatar";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const AvatarCropDialog = ({ source, onApply, onClose }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(source.file);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState(source.crop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(source.zoom || MIN_ZOOM);
  const [area, setArea] = useState(null);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const controlsDisabled = !image || error || isProcessing;

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImage(url);
    img.onerror = () => setError(true);
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleApply = async () => {
    if (!area || isProcessing) return;
    setIsProcessing(true);
    setError(false);
    try {
      const croppedFile = await cropAvatar(image, area, file);
      onApply(croppedFile, { ...source, file, crop, zoom });
    } catch {
      setError(true);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(MIN_ZOOM);
  };

  const handleChoosePhoto = (event) => {
    const nextFile = event.target.files[0];
    event.target.value = "";
    if (!nextFile) return;
    setImage(null);
    setArea(null);
    setError(false);
    setFile(nextFile);
    handleReset();
  };

  return (
    <Dialog
      open
      onClose={isProcessing ? undefined : onClose}
      fullWidth
      maxWidth={false}
      aria-labelledby="avatar-crop-title"
      aria-describedby="avatar-crop-hint"
      slotProps={{ paper: { sx: {
        width: { xs: "calc(100% - 24px)", sm: "calc(100% - 48px)" },
        maxWidth: 744,
        maxHeight: "calc(100dvh - 32px)",
        m: 2,
        borderRadius: 3,
        "& .MuiButton-root": { textTransform: "none", fontWeight: 600, borderRadius: 2 },
      } } }}
    >
      <DialogTitle component="div" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, p: { xs: 2, sm: 3 }, pb: { xs: 3, sm: 5 } }}>
        <Typography id="avatar-crop-title" component="h2" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 700, color: "font_color.heading" }}>
          {t("ui.profile_photo")}
        </Typography>
        <TooltipIconButton title={t("ui.close")} onClick={onClose} disabled={isProcessing} size="small" sx={{ alignSelf: "flex-start", color: "color.slate_2" }}>
          <CloseRoundedIcon />
        </TooltipIconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Typography id="avatar-crop-hint" variant="body2" sx={{ mb: 2.5, color: "font_color.heading", fontSize: { xs: 14, sm: 16 } }}>
          {t("ui.avatar_crop_hint")}
        </Typography>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: "min(340px, 45dvh)", sm: "min(420px, 52dvh)" },
            overflow: "hidden",
            borderRadius: "24px",
            border: "1px dashed",
            borderColor: "grey.400",
            bgcolor: "common.black",
            pointerEvents: isProcessing ? "none" : "auto",
          }}
        >
          {image ? (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              aspect={1}
              cropShape="round"
              objectFit="contain"
              showGrid={false}
              style={{
                containerStyle: { top: 12, right: 12, bottom: 12, left: 12 },
                cropAreaStyle: { border: "1px solid rgba(255, 255, 255, 0.65)", color: "rgba(0, 0, 0, 0.5)" },
              }}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
              mediaProps={{ onError: () => { setArea(null); setError(true); } }}
            />
          ) : (
            <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
              <CircularProgress size={32} />
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, mt: 2 }}>
          <TooltipIconButton title={t("ui.zoom_out")} onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - 0.1))} disabled={controlsDisabled || zoom <= MIN_ZOOM} size="small">
            <ZoomOutRoundedIcon fontSize="small" />
          </TooltipIconButton>
          <Slider
            aria-label={t("ui.zoom")}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(_, value) => setZoom(value)}
            disabled={controlsDisabled}
            sx={{ flex: 1, mx: 0.5, "& .MuiSlider-thumb": { width: 24, height: 24 }, "& .MuiSlider-rail": { opacity: 0.35 } }}
          />
          <TooltipIconButton title={t("ui.zoom_in")} onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + 0.1))} disabled={controlsDisabled || zoom >= MAX_ZOOM} size="small">
            <ZoomInRoundedIcon fontSize="small" />
          </TooltipIconButton>
          <TooltipIconButton title={t("ui.reset")} onClick={handleReset} disabled={controlsDisabled} sx={{ border: "1px solid", borderColor: "divider", ml: 0.5 }}>
            <RestartAltRoundedIcon fontSize="small" />
          </TooltipIconButton>
        </Box>
        <Button component="label" disabled={isProcessing} sx={{ mt: 1, px: 0.75, fontSize: 16 }}>
          {t("ui.choose_another_photo")}
          <input type="file" accept="image/*" hidden disabled={isProcessing} onChange={handleChoosePhoto} />
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{t("dashboard.loading_error")}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 2, gap: 1, "& .MuiButton-root": { fontSize: 16 } }}>
        <Button onClick={onClose} disabled={isProcessing} sx={{ minHeight: 44, px: 2 }}>{t("ui.cancel")}</Button>
        <Button variant="contained" onClick={handleApply} disabled={!area || error || isProcessing} sx={{ minHeight: 44, px: 2.5 }}>
          {isProcessing && <CircularProgress size={16} sx={{ mr: 1 }} />}
          {t("ui.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarCropDialog;
