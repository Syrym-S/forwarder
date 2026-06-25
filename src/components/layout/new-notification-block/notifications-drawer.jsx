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
          {notifications?.map((notification) => {
            const isViewd = notification.is_viewed;

            return (
              <Box
                onClick={() => {
                  setSelectedNotification(notification);
                  handleNotificationsClose();
                  handleCloseDrawer();
                }}
                sx={{
                  p: 1,
                  backgroundColor: isViewd
                    ? "white"
                    : "rgba(144, 202, 249, 0.1)",
                  border: "1px solid rgba(0,0,0,0.1)",
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
