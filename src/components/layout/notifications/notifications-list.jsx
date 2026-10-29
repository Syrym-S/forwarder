import { useTranslation } from "react-i18next";
import { Alert, Box, Button, Chip, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationItem from "./notification-item";
import NotificationState from "./notification-state";

const NotificationsList = ({
  notViewedCount,
  notifications,
  setSelectedNotification,
  handleNotificationsClose,
  handleOpenDrawer,
}) => {
  const { t } = useTranslation();
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const error = useNotificationsStore((state) => state.error);
  return (
    <Box
      sx={{
        width: { xs: "calc(100vw - 32px)", sm: 400 },
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        maxHeight: "min(680px, 80dvh)",
      }}
    >
      <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{ fontSize: 18, fontWeight: 600, color: "font_color.heading" }}
          >{t("ui.notifications")}</Typography>
          {notViewedCount > 0 && (
            <Chip
              size="small"
              label={notViewedCount}
              color="primary"
              sx={{ height: 22, fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography sx={{ mt: 0.75, fontSize: 13, color: "text.secondary" }}>{t("ui.latest_lead_auction_events")}</Typography>
      </Box>
      <Box sx={{ overflowY: "auto", minHeight: 0 }}>
        {error ? (
          <Alert severity="error" sx={{ m: 2 }}>{t("ui.notifications_load_failed_retry")}</Alert>
        ) : isLoading || !notifications.length ? (
          <NotificationState loading={isLoading} />
        ) : (
          <Box sx={{ p: 1.5, display: "grid", gap: 1 }}>
            {notifications.slice(0, 10).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                setSelectedNotification={setSelectedNotification}
                handleNotificationsClose={handleNotificationsClose}
              />
            ))}
          </Box>
        )}
      </Box>
      <Box sx={{ p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
        <Button
          fullWidth
          onClick={handleOpenDrawer}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ textTransform: "none", borderRadius: 2, py: 1 }}
        >{t("ui.all_notifications")}</Button>
      </Box>
    </Box>
  );
};
export default NotificationsList;
