import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import {
  Box,
  Chip,
  CircularProgress,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import NotificationItem from "./notification-item";

const NotificationsList = ({
  notViewedCount,
  notifications,
  setSelectedNotification,
  handleNotificationsClose,
  handleOpenDrawer,
}) => {
  const isLoading = useNotificationsStore((state) => state.isLoading);

  const isEmpty = notifications.length === 0;

  return (
    <Paper
      sx={{
        width: 300,
        height: isEmpty ? "fit-content" : 500,
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
            fontSize: "0.8rem",
          }}
        >
          Уведомления
        </Typography>
        <Typography
          sx={{
            fontWeight: "400",
            fontSize: "0.rem",
            color: "backgound.main",
          }}
        >
          Последние события по вашим заявкам и тендерам
        </Typography>
      </Box>

      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
          overflowY: "auto",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              height: "100%",
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
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: "1px solid ",
            }}
          >
            <ListItemText
              primary="Уведомлений пока нет"
              secondary="Здесь будут отображаться новые события"
            />
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              display: "grid",
              alignItems: "start",
              gridTemplateColumns: "1fr",
            }}
          >
            {notifications?.slice(0, 10).map((notification) => (
              <NotificationItem
                notification={notification}
                setSelectedNotification={setSelectedNotification}
                handleNotificationsClose={handleNotificationsClose}
              />
            ))}
          </Box>
        )}
      </Box>

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
