import Header from "../../components/layout/header";
import SideBar from "../../components/layout/menu";
import NotificationPopup from "../../components/layout/notifications/notification-popup";
import RenderNotificationIcon from "../../shared/ui/render-notification-icon";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Snackbar, Typography } from "@mui/material";
import { useNotificationsStore } from "../store/notifications/noti-store";

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

  const socketRef = useRef(null);

  const handleOpenPopUp = () => {
    setNotificationPopUpItem(newNotification);
  };

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
              px: 1.5,
              py: 1.25,
              width: 280,
              minHeight: 80,
              backgroundColor: "primary.main",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.95rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                color: "white",
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              <RenderNotificationIcon type={newNotification?.type} />

              {newNotification?.theme}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "white",
                lineHeight: 1.3,

                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
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
