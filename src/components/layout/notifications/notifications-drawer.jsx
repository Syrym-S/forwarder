import {
  Box,
  Button,
  Drawer,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationItem from "./notification-item";

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

  const PAGE_COUNT = Math.ceil(total / perPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getNotifications({
      page: page,
    });
  }, [page]);

  console.log(notifications);

  return (
    <Drawer
      anchor="right"
      open={openNotificationsDrawer}
      onClose={handleCloseDrawer}
    >
      <Box
        sx={{
          width: "30vw",
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
          <IconButton onClick={handleCloseDrawer}>
            <HighlightOffRoundedIcon color="error" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
        >
          {notifications?.map((notification) => (
            <NotificationItem
              notification={notification}
              setSelectedNotification={setSelectedNotification}
              handleNotificationsClose={handleNotificationsClose}
            />
          ))}
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
