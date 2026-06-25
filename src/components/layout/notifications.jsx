import { useEffect } from "react";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { Box, Paper, Typography } from "@mui/material";

const Notifications = ({
  notifications,
  setSelectedNotification,
  handleNotificationsClose,
}) => {
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <Paper
      sx={{
        width: 300,
        minHeight: 350,
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "1rem",
          }}
        >
          Уведомления
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: "0.7rem",
            color: "backgound.main",
          }}
        >
          Последние события по вашим заявкам и тендерам
        </Typography>
      </Box>

      {notifications?.slice(0, 5).map((notification) => {
        const isViewd = notification.is_viewed;

        return (
          <Box
            onClick={() => {
              setSelectedNotification(notification);
              handleNotificationsClose();
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
              {notification.theme}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "backgound.main",
              }}
            >
              {notification.message}
            </Typography>
          </Box>
        );
      })}

      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          Смотреть все увидомления
        </Typography>
      </Box>
    </Paper>
  );
};

export default Notifications;
