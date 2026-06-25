import { useState } from "react";
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
import Notifications from "./notifications";

const Header = ({ openMenu, setOpenMenu }) => {
  const navigate = useNavigate();
  const notifications = useNotificationsStore((state) => state.notifications);
  // const getNotifications = useNotificationsStore(
  //   (state) => state.getNotifications,
  // );

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

  // const toggleNotificationsBlock = () => {
  //   setOpenNotificationsBlock((prev) => !prev);
  // };

  // useEffect(() => {
  //   getNotifications();
  // }, []);

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
        <IconButton
          aria-describedby={id}
          onClick={handleNotificationsClick}
          sx={{
            mx: 2,
          }}
        >
          <Badge badgeContent={4} max={99} color="error">
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
          {notifications?.length === 0 && (
            <Paper
              sx={{
                width: 300,
                minHeight: 300,
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
            </Paper>
          )}

          <Notifications
            notifications={notifications}
            setSelectedNotification={setSelectedNotification}
            handleNotificationsClose={handleNotificationsClose}
          />
          {/* <Paper
            sx={{
              width: 300,
              minHeight: 350,
              display: "grid",
              gridTemplateColumns: "1fr",
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                Уведомления
              </Typography>
              <Typography
                sx={{
                  fontWeight: "400",
                  fontSize: "0.7rem",
                  color: "backgound.main",
                }}
              >
                Последние события по вашим заявкам и тендерам
              </Typography>
            </Box>

            {notifications?.slice(0, 5).map((notification) => {
              const isViewd = notification.is_viewed;

              return (
                <Box
                  onClick={() => {
                    setSelectedNotification(notification);
                    handleNotificationsClose();
                  }}
                  sx={{
                    p: 1,
                    backgroundColor: isViewd
                      ? "white"
                      : "rgba(144, 202, 249, 0.1)",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    cursor: !isViewd && "pointer",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      height: "fit-content",
                    }}
                  >
                    {!isViewd && (
                      <Typography
                        component="span"
                        fontWeight="bold"
                        sx={{
                          color: "#2196f3",
                          fontSize: "1.5rem",
                        }}
                      >
                        •
                      </Typography>
                    )}
                    {notification.theme}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "backgound.main",
                    }}
                  >
                    {notification.message}
                  </Typography>
                </Box>
              );
            })}

            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "1rem",
                  textAlign: "center",
                }}
              >
                Смотреть все увидомления
              </Typography>
            </Box>
          </Paper> */}
        </Popover>

        {selectedNotification && (
          <NotificationPopup
            selectedNotification={selectedNotification}
            setSelectedNotification={setSelectedNotification}
          />
        )}
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
