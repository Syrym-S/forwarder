import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationItem from "./notification-item";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

const NotificationsDrawer = ({
  openNotificationsDrawer,
  handleCloseDrawer,
  setSelectedNotification,
  handleNotificationsClose,
}) => {
  const [page, setPage] = useState(1);

  const total = useNotificationsStore((state) => state.total);
  const perPage = useNotificationsStore((state) => state.perPage);
  const notifications = useNotificationsStore((state) => state.notifications);
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );
  const isLoading = useNotificationsStore((state) => state.isLoading);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);

  const PAGE_COUNT = Math.ceil(total / perPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleReadAllNotifications = async () => {
    await markAllAsRead();
    await getNotifications();
  };

  useEffect(() => {
    getNotifications({
      page: page,
    });
  }, [page]);

  return (
    <Drawer
      anchor="right"
      open={openNotificationsDrawer}
      onClose={handleCloseDrawer}
    >
      <Box
        sx={{
          width: {
            xs: "80vw",
            sm: "30vw",
          },
          py: 2,
        }}
      >
        <Box
          sx={{
            px: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: "400",
            }}
          >
            Увидомления
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <IconButton
              onClick={handleReadAllNotifications}
              disabled={isLoading}
            >
              <Tooltip title="Отметить все прочитанным">
                <MarkEmailReadOutlinedIcon color="primary" />
              </Tooltip>
            </IconButton>

            <IconButton onClick={handleCloseDrawer}>
              <HighlightOffRoundedIcon color="error" />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            minHeight: "100vh",
            display: "grid",
            gridTemplateColumns: "1fr",
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
          ) : (
            notifications?.map((notification) => (
              <NotificationItem
                notification={notification}
                setSelectedNotification={setSelectedNotification}
                handleNotificationsClose={handleNotificationsClose}
                handleCloseDrawer={handleCloseDrawer}
              />
            ))
          )}
        </Box>

        <Pagination
          page={page}
          count={PAGE_COUNT}
          onChange={handlePageChange}
          sx={{
            width: "fit-content",
            mx: "auto",
            my: 1,
            bottom: "0",
          }}
        />
      </Box>
    </Drawer>
  );
};

export default NotificationsDrawer;
