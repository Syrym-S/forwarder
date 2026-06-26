import { useEffect, useRef, useState } from "react";
import Header from "./components/layout/header";
import Sidebar from "./components/layout/menu";
import { NotificationsColumn } from "./shared/ui/notifications-column";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./app/router/app-router";
import { Alert, Box, Popover, Snackbar, Typography } from "@mui/material";
import RootLayout from "./components/layout/root-layout";
import { AppInitializer } from "./app/router/app-init";
import { getNotificationsTokenApi } from "./app/store/notifications/api";
import { useNotificationsStore } from "./app/store/notifications/noti-store";
import NotificationItem from "./components/layout/notifications/notification-item";
import RenderNotificationIcon from "./shared/ui/render-notification-icon";

const connectNotifications = async () => {
  const tokenResponse = await getNotificationsTokenApi();

  const socket = new WebSocket(
    `wss://notification.360logistics.kz/socket?token=${tokenResponse.token}`,
  );

  return socket;
};

function App() {
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );

  const [openMenu, setOpenMenu] = useState(false);
  const [newNotification, setNewNotification] = useState(null);

  const socketRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const socket = await connectNotifications();

      socket.onmessage = async () => {
        await getNotifications();

        const currentNotifications =
          useNotificationsStore.getState().notifications[0];

        if (!currentNotifications.is_viewed) {
          setNewNotification(currentNotifications);
        }
      };

      socketRef.current = socket;
    };

    init();

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    console.log("newNotification", newNotification);
  }, [newNotification]);

  return (
    <BrowserRouter basename="/forwarder">
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <Box style={{ display: "flex", width: "100%" }}>
        <Sidebar openMenu={openMenu} setOpenMenu={setOpenMenu} />
        <AppRouter />

        <Snackbar
          open={!!newNotification}
          autoHideDuration={5000}
          onClose={() => setNewNotification(null)}
          message={newNotification?.theme}
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
                backgroundColor: "rgba(144, 202, 249, 0.1)",
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
                }}
              >
                <RenderNotificationIcon type={newNotification?.type} />
                {newNotification?.theme}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "backgound.main",
                }}
              >
                {newNotification?.message}
              </Typography>
            </Box>
          )}
        </Snackbar>
      </Box>
      <NotificationsColumn />
      <AppInitializer />
    </BrowserRouter>
  );
}

export default App;
