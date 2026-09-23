import { Box, ButtonBase, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import RenderNotificationIcon from "../../../shared/ui/render-notification-icon";

const NotificationItem = ({
  notification,
  setSelectedNotification,
  handleNotificationsClose,
  handleCloseDrawer,
}) => {
  const unread = notification?.is_viewed === false;
  return (
    <ButtonBase
      onClick={() => {
        setSelectedNotification(notification);
        handleNotificationsClose?.();
        handleCloseDrawer?.();
      }}
      sx={{
        width: "100%",
        textAlign: "left",
        alignItems: "flex-start",
        gap: 1.5,
        p: 2,
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: unread ? "primary.main" : "divider",
        bgcolor: unread ? "background.main" : "background.paper",
        transition: "background-color 150ms",
        "&:hover": { bgcolor: "background.slate" },
        "&.Mui-focusVisible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: 2,
          bgcolor: unread ? "background.paper" : "background.slate",
          color: "primary.main",
        }}
      >
        <RenderNotificationIcon type={notification?.type || ""} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          component="span"
          sx={{
            display: "block",
            fontSize: 14,
            fontWeight: unread ? 600 : 500,
            color: "font_color.heading",
            overflowWrap: "anywhere",
          }}
        >
          {notification?.theme || "Уведомление"}
        </Typography>
        <Typography
          component="span"
          sx={{
            mt: 0.5,
            fontSize: 13,
            lineHeight: 1.6,
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            overflowWrap: "anywhere",
          }}
        >
          {notification?.message}
        </Typography>
        {unread && (
          <Typography
            component="span"
            sx={{
              display: "block",
              mt: 1,
              fontSize: 11,
              fontWeight: 600,
              color: "primary.main",
            }}
          >
            Новое
          </Typography>
        )}
      </Box>
      <ChevronRightRoundedIcon
        sx={{ mt: 1, fontSize: 18, color: "text.secondary", flexShrink: 0 }}
      />
    </ButtonBase>
  );
};
export default NotificationItem;
