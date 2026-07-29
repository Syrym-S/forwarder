import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/layout/header";
import { Outlet } from "react-router-dom";
import { Box, IconButton, Snackbar, Tooltip, Typography } from "@mui/material";
import SideBar from "../../components/layout/menu";
import NotificationPopup from "../../components/layout/notifications/notification-popup";
import { useNotificationsStore } from "../store/notifications/noti-store";
import RenderNotificationIcon from "../../shared/ui/render-notification-icon";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

const supportEmail = window?.APP_DATA?.support?.email;
const supportPhone = window?.APP_DATA?.support?.phone;

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

      <Box
        sx={{
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bottom: 20,
          right: 20,
        }}
      >
        <Tooltip
          title={`Почта для связи: ${supportEmail}`}
          placement="left"
          slotProps={{
            tooltip: {
              sx: {
                backgroundImage:
                  "linear-gradient(135deg, #1976d2 40%, #80c0f4 100%)",
                color: "#fff",
                fontWeight: 500,
                borderRadius: 2,
                px: 1.5,
                py: 1,
                boxShadow: 3,
              },
            },
            arrow: {
              sx: {
                color: "primary.main",
              },
            },
          }}
        >
          <Box
            component="a"
            href={`mailto:${supportEmail}?subject=${encodeURIComponent(
              "Обращение в поддержку",
            )}&body=${encodeURIComponent(
              "Здравствуйте! У меня возник вопрос.",
            )}`}
            sx={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50px",
              height: "50px",
              borderRadius: 2,
              boxShadow: 1,
              backgroundImage:
                "linear-gradient(135deg, #1976d2 40%, #80c0f4 100%)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",

              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "50%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent)",
                transform: "skewX(-25deg)",
                transition: "left 0.6s ease",
              },

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,

                "&::before": {
                  left: "150%",
                },
              },
            }}
          >
            <MarkunreadOutlinedIcon
              sx={{
                position: "relative",
                zIndex: 1,
                color: "#fff",
              }}
            />
          </Box>
        </Tooltip>

        <Tooltip
          title={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    opacity: 0.7,
                  }}
                >
                  Номер для связи
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {supportPhone}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  navigator.clipboard.writeText(supportPhone);
                }}
                sx={{
                  color: "#fff",
                  ml: 0.5,

                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  },
                }}
              >
                <ContentCopyOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          placement="left"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                backgroundImage:
                  "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)",
                color: "#fff",
                fontWeight: 500,
                borderRadius: 2,
                px: 1.5,
                py: 1,
                boxShadow: 3,
              },
            },
            arrow: {
              sx: {
                color: "#1a1a1a",
              },
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "50px",
              height: "50px",
              borderRadius: 2,
              boxShadow: 1,
              backgroundImage:
                "linear-gradient(135deg, #1a1a1a 0%, #3d3d3d 100%)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",

              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "50%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent)",
                transform: "skewX(-25deg)",
                transition: "left 0.6s ease",
              },

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,

                "&::before": {
                  left: "150%",
                },
              },
            }}
          >
            <PhoneOutlinedIcon
              sx={{
                color: "#fff",
              }}
            />
          </Box>
        </Tooltip>
      </Box>
    </>
  );
};

export default AppContentContainer;
