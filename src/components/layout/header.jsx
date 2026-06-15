import { useState } from "react";
import LogoutModal from "./logout-modal";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./style.css";
import Box from "@mui/material/Box";
import {
  Alert,
  AppBar,
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";

const Header = ({ openMenu, setOpenMenu }) => {
  const navigate = useNavigate();
  const notifications = [];

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

  const toggleNotificationsBlock = () => {
    setOpenNotificationsBlock((prev) => !prev);
  };

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
        <IconButton aria-describedby={id} onClick={handleNotificationsClick}>
          <NotificationsIcon />
        </IconButton>
        <Popover
          id={id}
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
          <Paper
            sx={{
              width: 380,
              minHeight: 300,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {notifications.length === 0 && (
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <NotificationsOffOutlinedIcon
                  sx={{
                    fontSize: "10rem",
                    color: "#D6D4D4",
                  }}
                />
                <Typography>Увидомлений нет</Typography>
              </Box>
            )}
          </Paper>
        </Popover>
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
