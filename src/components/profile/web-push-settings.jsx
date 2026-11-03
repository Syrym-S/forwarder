import { Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useProfileStore } from "../../app/store/profile/profile-store.js";
import { useWebPushStore } from "../../app/store/notifications/web-push-store.js";
import { getWebPushPermission } from "../../services/firebase.js";

export default function WebPushSettings() {
  const { t } = useTranslation();
  const enabled = useProfileStore((state) => state.profileData?.pushEnabled === true);
  const { busy, initialized, error, setEnabled, retry } = useWebPushStore();
  const blocked = getWebPushPermission() === "denied";
  const toggle = (event) => { setEnabled(event.target.checked).catch(() => {}); };
  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={enabled} onChange={toggle} disabled={busy || !initialized} />}
        label={t("webPush.label")}
      />
      {busy && <CircularProgress size={16} aria-label={t("webPush.saving")} />}
      <Typography variant="body2" color="text.secondary">{t("webPush.description")}</Typography>
      {blocked && <Alert severity="warning" sx={{ mt: 1 }}>{t("webPush.blocked")}</Alert>}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {t(`webPush.errors.${error}`, { defaultValue: t("webPush.failed") })}
          <Button size="small" onClick={retry} disabled={busy}>{t("webPush.retry")}</Button>
        </Alert>
      )}
    </Box>
  );
}
