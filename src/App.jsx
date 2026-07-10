import { useEffect, useRef, useState } from "react";
import Header from "./components/layout/header";
import Sidebar from "./components/layout/menu";
import { NotificationsColumn } from "./shared/ui/notifications-column";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router/app-router";
import { Alert, Box, Popover, Snackbar, Typography } from "@mui/material";
import RootLayout from "./components/layout/root-layout";
import { AppInitializer } from "./app/router/app-init";
import { useNotificationsStore } from "./app/store/notifications/noti-store";
import NotificationItem from "./components/layout/notifications/notification-item";
import RenderNotificationIcon from "./shared/ui/render-notification-icon";
import { isStaging } from "./app/client";
import NotificationPopup from "./components/layout/notifications/notification-popup";

function App() {
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

  const [openMenu, setOpenMenu] = useState(false);
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
    <BrowserRouter basename={isStaging ? "/staging/forwarder" : "/forwarder"}>
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <Box style={{ display: "flex", width: "100%" }}>
        <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <AppRouter />

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
      </Box>
      <NotificationsColumn />
      <AppInitializer />
    </BrowserRouter>
  );
}

export default App;
