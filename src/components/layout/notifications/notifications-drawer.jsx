import {
  Alert,
  Box,
  Button,
  Drawer,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationItem from "./notification-item";
import NotificationState from "./notification-state";

const NotificationsDrawer = ({
  openNotificationsDrawer,
  handleCloseDrawer,
  setSelectedNotification,
  handleNotificationsClose,
}) => {
  const [page, setPage] = useState(1);
  const {
    total,
    perPage,
    notifications,
    getNotifications,
    isLoading,
    markAllAsRead,
    error,
  } = useNotificationsStore();
  const pageCount = Math.ceil(total / Math.max(perPage, 1));

  useEffect(() => {
    if (openNotificationsDrawer) getNotifications({ page });
  }, [page, openNotificationsDrawer, getNotifications]);

  const handleReadAll = async () => {
    await markAllAsRead();
    if (!useNotificationsStore.getState().error)
      await getNotifications({ page });
  };

  return (
    <Drawer
      anchor="right"
      open={openNotificationsDrawer}
      onClose={handleCloseDrawer}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 460 },
            maxWidth: "100%",
            bgcolor: "background.default",
          },
        },
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            sx={{ fontSize: 22, fontWeight: 600, color: "font_color.heading" }}
          >
            Уведомления
          </Typography>
          <IconButton
            aria-label="Закрыть уведомления"
            onClick={handleCloseDrawer}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
          Все события по вашим перевозкам и аукционам
        </Typography>
        <Button
          onClick={handleReadAll}
          disabled={isLoading || !total}
          startIcon={<DoneAllRoundedIcon />}
          sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}
        >
          Отметить все прочитанными
        </Button>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            Не удалось выполнить действие. Попробуйте ещё раз.
          </Alert>
        ) : isLoading || !notifications.length ? (
          <NotificationState loading={isLoading} />
        ) : (
          <Box sx={{ p: 2, display: "grid", gap: 1.5 }}>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                setSelectedNotification={setSelectedNotification}
                handleNotificationsClose={handleNotificationsClose}
                handleCloseDrawer={handleCloseDrawer}
              />
            ))}
          </Box>
        )}
      </Box>
      {pageCount > 1 && (
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            page={page}
            count={pageCount}
            disabled={isLoading}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            siblingCount={0}
          />
        </Box>
      )}
    </Drawer>
  );
};
export default NotificationsDrawer;
