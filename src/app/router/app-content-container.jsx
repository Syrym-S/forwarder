import Header from "../../components/layout/header";
import SideBar from "../../components/layout/menu";
import NotificationPopup from "../../components/layout/notifications/notification-popup";
import RenderNotificationIcon from "../../shared/ui/render-notification-icon";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Slide, Snackbar, Typography } from "@mui/material";
import { useNotificationsStore } from "../store/notifications/noti-store";

const AppContentContainer = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const connectNotifications = useNotificationsStore(
    (state) => state.connectNotifications,
  );

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  // Keep the content mounted while the Snackbar finishes its exit transition.
  const [displayedNotification, setDisplayedNotification] =
    useState(newNotification);

  if (newNotification && newNotification !== displayedNotification) {
    setDisplayedNotification(newNotification);
  }

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
        await getNotifications(undefined, { showSnackbar: true });
      };

      socketRef.current = socket;
    };

    init();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    getNotifications(undefined, { showSnackbar: true });
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
        onClick={handleOpenPopUp}
        slots={{ transition: Slide }}
        slotProps={{
          transition: {
            direction: "left",
            easing: { enter: "ease-out", exit: "ease-in-out" },
            onExited: () => setDisplayedNotification(null),
          },
        }}
        transitionDuration={{ enter: 300, exit: 300 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
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
            {displayedNotification && (
              <RenderNotificationIcon type={displayedNotification.type} />
            )}

            {displayedNotification?.theme}
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
            {displayedNotification?.message}
          </Typography>
        </Box>
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
