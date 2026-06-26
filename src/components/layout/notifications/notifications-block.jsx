import {
  Badge,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Popover,
} from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useState } from "react";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import NotificationsList from "./notifications-list";
import Loader from "../loader";
import NotificationPopup from "./notification-popup";
import NotificationsDrawer from "./notifications-drawer";

const NotificationsBlock = () => {
  const notifications = useNotificationsStore((state) => state.notifications);

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
        aria-describedby={id}
        onClick={handleNotificationsClick}
        sx={{
          mx: 2,
        }}
      >
        <Badge badgeContent={notViewedCount} max={99} color="error">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        sx={{
          borderRadius: "10px",
        }}
        open={isNotificationsOpen}
        anchorEl={notificationsAnchorEl}
        onClose={handleNotificationsClose}
        style={{
          top: 0,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
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
        openNotificationsDrawer={openNotificationsDrawer}
        handleCloseDrawer={handleCloseDrawer}
        setSelectedNotification={setSelectedNotification}
        handleNotificationsClose={handleNotificationsClose}
      />
    </>
  );
};

export default NotificationsBlock;
