import { Badge, IconButton, Popover } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useState } from "react";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationsList from "./notifications-list";
import NotificationPopup from "./notification-popup";
import NotificationsDrawer from "./notifications-drawer";

const NotificationsBlock = () => {
  const notifications = useNotificationsStore((state) => state.notifications);
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );

  const notViewedCount = notifications.filter(
    (notification) => notification.is_viewed === false,
  ).length;

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openNotificationsDrawer, setOpenNotificationsDrawer] = useState(false);

  const isNotificationsOpen = Boolean(notificationsAnchorEl);

  const id = notificationsAnchorEl ? "simple-popover" : undefined;

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    getNotifications({ page: 1 });
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleOpenDrawer = () => {
    setOpenNotificationsDrawer(true);
    handleNotificationsClose();
  };

  const handleCloseDrawer = () => {
    setOpenNotificationsDrawer(false);
  };

  return (
    <>
      <IconButton
        aria-label="Открыть уведомления"
        aria-expanded={isNotificationsOpen}
        aria-describedby={id}
        onClick={handleNotificationsClick}
        sx={{
          mx: { xs: 0, sm: 1 },
          width: 40,
          height: 40,
          borderRadius: 2,
          border: "1px solid",
          borderColor: isNotificationsOpen ? "primary.main" : "divider",
          color: "primary.main",
          bgcolor: isNotificationsOpen ? "background.main" : "background.paper",
          "&:hover": { bgcolor: "background.main" },
        }}
      >
        <Badge badgeContent={notViewedCount} max={99} color="error">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 12px 40px rgba(22, 36, 62, 0.14)",
            },
          },
        }}
        open={isNotificationsOpen}
        anchorEl={notificationsAnchorEl}
        onClose={handleNotificationsClose}
        style={{
          top: 0,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <NotificationsList
          notViewedCount={notViewedCount}
          notifications={notifications}
          setSelectedNotification={setSelectedNotification}
          handleNotificationsClose={handleNotificationsClose}
          handleOpenDrawer={handleOpenDrawer}
        />
      </Popover>

      {selectedNotification && (
        <NotificationPopup
          selectedNotification={selectedNotification}
          setSelectedNotification={setSelectedNotification}
        />
      )}

      <NotificationsDrawer
        key={openNotificationsDrawer ? "open" : "closed"}
        openNotificationsDrawer={openNotificationsDrawer}
        handleCloseDrawer={handleCloseDrawer}
        setSelectedNotification={setSelectedNotification}
        handleNotificationsClose={handleNotificationsClose}
      />
    </>
  );
};

export default NotificationsBlock;
