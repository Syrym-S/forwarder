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
} from "@mui/material";
import Cropper from "react-easy-crop";
import { cropAvatar } from "../../features/profile-edit/crop-avatar";

const AvatarCropDialog = ({ source, onApply, onClose }) => {
  const { t } = useTranslation();

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState(source.crop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(source.zoom || 1);
  const [area, setArea] = useState(null);
  const [error, setError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(source.file);
    const img = new Image();
    img.onload = () => setImage(url);
    img.onerror = () => setError(true);
    img.src = url;
    return () => {
      img.onload = null;
      img.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [source.file]);

  const handleApply = async () => {
    if (!area || isProcessing) return;
    setIsProcessing(true);
    setError(false);
    try {
      const file = await cropAvatar(image, area, source.file);
      onApply(file, { ...source, crop, zoom });
    } catch {
      setError(true);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open
      onClose={isProcessing ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="avatar-crop-title"
    >
      <DialogTitle id="avatar-crop-title">{t("ui.profile_photo")}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            position: "relative",
            width: 400,
            maxWidth: "100%",
            aspectRatio: "1 / 1",
            mx: "auto",
            overflow: "hidden",
            borderRadius: 2,
            pointerEvents: isProcessing ? "none" : "auto",
          }}
        >
          {image ? (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              objectFit="cover"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
              mediaProps={{
                onError: () => {
                  setArea(null);
                  setError(true);
                },
              }}
            />
          ) : (
            <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t("dashboard.loading_error")}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isProcessing}>
          {t("ui.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleApply}
          disabled={!area || isProcessing}
        >
          {isProcessing && <CircularProgress size={16} sx={{ mr: 1 }} />}
          {t("dashboard.apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarCropDialog;
