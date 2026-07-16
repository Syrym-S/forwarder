import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layout/header";
import { Outlet } from "react-router-dom";
import { Box, Snackbar, Typography } from "@mui/material";
import SideBar from "../../components/layout/menu";
import NotificationPopup from "../../components/layout/notifications/notification-popup";
import { useNotificationsStore } from "../store/notifications/noti-store";
import RenderNotificationIcon from "../../shared/ui/render-notification-icon";

const AppContentContainer = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const connectNotifications = useNotificationsStore(
    (state) => state.connectNotifications,
  );
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );
  const clearNewNotificationValue = useNotificationsStore(
    (state) => state.clearNewNotificationValue,
  );

  const [notificationPopUpItem, setNotificationPopUpItem] = useState(null);

  const handleOpenPopUp = () => {
    setNotificationPopUpItem(newNotification);
  };

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const socket = await connectNotifications();

      socket.onmessage = async () => {
        await getNotifications();
      };

      socketRef.current = socket;
    };

    init();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <>
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />

      <Box style={{ display: "flex", width: "100%" }}>
        <SideBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
      </Box>

      <Box flex={1}>
        <Outlet />
      </Box>

      <Snackbar
        open={!!newNotification}
        onClose={clearNewNotificationValue}
        message={newNotification?.theme}
        onClick={handleOpenPopUp}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {newNotification && (
          <Box
            sx={{
              px: 2,
              py: 3,
              height: 100,
              width: 300,
              backgroundColor: "#1976d2",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: 1,
                height: "fit-content",
                color: "white",
              }}
            >
              <RenderNotificationIcon type={newNotification?.type} />
              {newNotification?.theme}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: "white",
              }}
            >
              {newNotification?.message}
            </Typography>
          </Box>
        )}
      </Snackbar>

      {notificationPopUpItem && (
        <NotificationPopup
          selectedNotification={notificationPopUpItem}
          setSelectedNotification={setNotificationPopUpItem}
        />
      )}
    </>
  );
};

export default AppContentContainer;
