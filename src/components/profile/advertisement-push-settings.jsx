import {
  Alert,
  Box,
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../app/store/profile/profile-store";

export default function AdvertisementPushSettings() {
  const { t } = useTranslation();

  const enabled = useProfileStore(
    (state) => state.profileData?.advertisementPushEnabled === true,
  );
  const hasProfile = useProfileStore((state) => Boolean(state.profileData));
  const isProfileLoading = useProfileStore((state) => state.isProfileLoading);
  const isSaving = useProfileStore((state) => state.isAdvertisementPushSaving);
  const error = useProfileStore((state) => state.advertisementPushSaveError);
  const setEnabled = useProfileStore((state) => state.setAdvertisementPushEnabled);

  const handleChange = (event) => {
    void setEnabled(event.target.checked);
  };

  return (
    <Box aria-busy={isSaving}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={handleChange}
              disabled={!hasProfile || isProfileLoading || isSaving}
              slotProps={{
                input: {
                  "aria-describedby": "advertisement-push-description",
                  name: "advertisementPushEnabled",
                },
              }}
            />
          }
          label={t("settings.advertisement_push_label")}
        />
        {isSaving && (
          <CircularProgress size={16} aria-label={t("ui.saving")} />
        )}
      </Box>
      <Typography
        id="advertisement-push-description"
        variant="body2"
        color="text.secondary"
      >
        {t("settings.advertisement_push_description")}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {t("settings.advertisement_push_save_failed")}
        </Alert>
      )}
    </Box>
  );
}
