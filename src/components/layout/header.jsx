import { useEffect, useState } from "react";
import LogoutModal from "./logout-modal";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./style.css";
import Box from "@mui/material/Box";
import {
  Alert,
  AppBar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Snackbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import NotificationPopup from "./notification-popup";
import Notifications from "./notifications-list";
import NotificationsBlock from "./new-notification-block/notifications-block";

const Header = ({ openMenu, setOpenMenu }) => {
  const navigate = useNavigate();
  const notifications = useNotificationsStore((state) => state.notifications);
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );

  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const id = notificationsAnchorEl ? "simple-popover" : undefined;
  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const userEmail = window?.APP_DATA?.user_email || "Пользователь";

  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };
  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleOpenProfileMenu = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setProfileAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    handleCloseProfileMenu();
    navigate("/profile");
  };

  const handleOpenLogoutModal = () => {
    handleCloseProfileMenu();
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <AppBar
      position="sticky"
      display="flex"
      sx={{
        top: 0,
        left: 0,
        height: 56,
        color: "#000000",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        backgroundColor: "background.default",
        zIndex: 2,
      }}
    >
      <MenuIcon
        sx={{
          transform: openMenu ? "rotate(90deg)" : "rotate(0)",
          transition: "0.2s",
          fontSize: "2rem",
          visibility: {
            xs: "visible",
            sm: "hidden",
          },
          cursor: "pointer",
        }}
        onClick={handleToggleMenu}
      />

      <Box>
        <NotificationsBlock />

        {/* {selectedNotification && (
          <NotificationPopup
            selectedNotification={selectedNotification}
            setSelectedNotification={setSelectedNotification}
          />
        )} */}
        <Button
          variant="outlined"
          startIcon={<AccountCircleIcon />}
          onClick={handleOpenProfileMenu}
          sx={{
            maxWidth: {
              xs: 180,
              sm: 260,
            },
            textTransform: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={userEmail}
        >
          {userEmail}
        </Button>
        <Menu
          anchorEl={profileAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleCloseProfileMenu}
        >
          <MenuItem onClick={handleNavigateProfile}>Профиль</MenuItem>

          <MenuItem>Настройки</MenuItem>

          <MenuItem onClick={handleOpenLogoutModal}>Выход</MenuItem>
        </Menu>
        <LogoutModal
          open={isLogoutModalOpen}
          handleOpenModal={handleCloseLogoutModal}
          handleCloseProfile={handleCloseProfileMenu}
        />
      </Box>
    </AppBar>
  );
};

export default Header;
