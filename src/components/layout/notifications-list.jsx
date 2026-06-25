import { useEffect } from "react";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";

const NotificationsList = ({
  notViewedCount,
  notifications,
  setSelectedNotification,
  handleNotificationsClose,
  handleOpenDrawer,
}) => {
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );
  const isLoading = useNotificationsStore((state) => state.isLoading);

  const isEmpty = notifications.length === 0;

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <Paper
      sx={{
        width: 300,
        height: 350,
        display: isLoading ? "" : "grid",
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

      {isLoading ? (
        <Box
          sx={{
            height: "80%",
            border: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : isEmpty ? (
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <NotificationsOffOutlinedIcon
            sx={{
              fontSize: "10rem",
              color: "#D6D4D4",
            }}
          />
          <Typography>Увидомлений нет</Typography>
        </Box>
      ) : (
        notifications?.slice(0, 5).map((notification) => {
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
        })
      )}

      <Box
        onClick={handleOpenDrawer}
        sx={{
          p: 2,
          cursor: "pointer",
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
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "0.8rem",
            textAlign: "center",
          }}
        >
          {notViewedCount !== 0 && (
            <Chip
              label={`+${notViewedCount}`}
              color="error"
              sx={{
                fontWeight: "500",
                fontSize: "0.6rem",
                textAlign: "center",
              }}
              size="small"
            />
          )}
          Новых увидомлений
        </Typography>
      </Box>
    </Paper>
  );
};

export default NotificationsList;
