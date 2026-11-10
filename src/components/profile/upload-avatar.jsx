import { useTranslation } from "react-i18next";
import { Alert, Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useProfileStore } from "../../app/store/profile/profile-store";
import { useState } from "react";
import { AVATAR_SIZE } from "../../features/profile-edit/crop-avatar";
import AvatarCropDialog from "./avatar-crop-dialog";

const UploadAvatar = ({
  selectedImg,
  preview,
  isAvatarRemoved,
  formValues,
  handleClearAvatar,
  onAvatarChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [editor, setEditor] = useState(null);
  const [originalCrop, setOriginalCrop] = useState(null);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [sourceError, setSourceError] = useState(false);
  const isProfileLoading = useProfileStore((state) => state.isProfileLoading);
  const isAvatarLoading = useProfileStore((state) => state.isAvatarLoading);
  const avatar = isAvatarRemoved ? null : formValues?.avatar;
  const displayedAvatar = preview || avatar;
  const isLoading = isAvatarLoading || isProfileLoading || isLoadingSource;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (file) {
      setSourceError(false);
      setEditor({ file });
    }
  };

  const handleEditCrop = async () => {
    if (disabled || isLoading) return;
    setSourceError(false);
    if (originalCrop) {
      setEditor(originalCrop);
      return;
    }

    setIsLoadingSource(true);
    try {
      const response = await fetch(displayedAvatar);
      if (!response.ok) throw new Error("Unable to load avatar");
      const blob = await response.blob();
      setEditor({ file: new File([blob], "avatar", { type: blob.type }) });
    } catch {
      setSourceError(true);
    } finally {
      setIsLoadingSource(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
        <Box
          sx={{
            position: "relative",
            width: 100,
            height: 100,
            flexShrink: 0,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover .avatar-edit-button, &:focus-within .avatar-edit-button": {
              opacity: 1,
              pointerEvents: "auto",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : displayedAvatar ? (
            <>
              <Box
                component="img"
                src={displayedAvatar}
                alt={t("ui.profile_photo")}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                className="avatar-edit-button"
                aria-label={`${t("ui.edit")} ${t("ui.profile_photo")}`}
                onClick={handleEditCrop}
                disabled={disabled}
                sx={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 150ms",
                  color: "common.white",
                  bgcolor: "rgba(0, 0, 0, 0.45)",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.55)" },
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </>
          ) : (
            <AccountCircleIcon color="primary" sx={{ fontSize: 100 }} />
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, gap: 1 }}>
          <Typography>{t("ui.profile_photo")}</Typography>
          <Typography>PNG / JPEG · {AVATAR_SIZE} × {AVATAR_SIZE} px</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" component="label" disabled={disabled || isLoading}>
              {t("ui.upload_photo")}
              <input
                name="file"
                type="file"
                hidden
                accept="image/*"
                disabled={disabled || isLoading}
                onChange={handleFileChange}
              />
            </Button>
            {(selectedImg || avatar) && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => {
                  setOriginalCrop(null);
                  setSourceError(false);
                  handleClearAvatar();
                }}
                disabled={disabled || isLoading}
              >
                {t("ui.delete")}
              </Button>
            )}
          </Box>
          {sourceError && <Alert severity="error">{t("dashboard.loading_error")}</Alert>}
        </Box>
      </Box>

      {editor && (
        <AvatarCropDialog
          source={editor}
          onClose={() => setEditor(null)}
          onApply={(file, source) => {
            onAvatarChange(file);
            setOriginalCrop(source);
            setEditor(null);
          }}
        />
      )}
    </>
  );
};

export default UploadAvatar;
