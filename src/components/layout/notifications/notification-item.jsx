import { Box, Typography } from "@mui/material";
import React from "react";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";
import RenderNotificationIcon from "../../../shared/ui/render-notification-icon";

const NotificationItem = ({
  notification,
  setSelectedNotification,
  handleNotificationsClose,
  handleCloseDrawer,
}) => {
  const isViewd = notification?.is_viewed;

  return (
    <Box
      onClick={() => {
        setSelectedNotification(notification);
        handleNotificationsClose();
        handleCloseDrawer();
      }}
      sx={{
        p: 1,
        backgroundColor: isViewd ? "white" : "rgba(144, 202, 249, 0.1)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        cursor: !isViewd && "pointer",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
          height: "fit-content",
        }}
      >
        {!isViewd && (
          <Typography
            component="span"
            fontWeight="bold"
            sx={{
              color: "#2196f3",
              fontSize: "1.5rem",
            }}
          >
            •
          </Typography>
        )}
        <RenderNotificationIcon type={notification?.type} />
        {notification?.theme}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.7rem",
          color: "backgound.main",
        }}
      >
        {notification?.message}
      </Typography>
    </Box>
  );
};

export default NotificationItem;
