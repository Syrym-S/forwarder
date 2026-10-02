import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import ActionTooltip from "../../shared/ui/action-tooltip";
import { useEffect, useState } from "react";
import LogoutModal from "./logout-modal";
import MenuIcon from "@mui/icons-material/Menu";
import "./style.css";
import Box from "@mui/material/Box";
import {
  AppBar,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import NotificationsBlock from "./notifications/notifications-block";
import { useProfileStore } from "../../app/store/profile/profile-store";
import logo from "../../../assets/logo.png";

const Header = ({ openMenu, setOpenMenu }) => {
  const navigate = useNavigate();

  const profileData = useProfileStore((state) => state.profileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const getNotifications = useNotificationsStore(
    (state) => state.getNotifications,
  );

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isProfileMenuOpen = Boolean(profileAnchorEl);
  const userEmail = window?.APP_DATA?.user_email || "Пользователь";

  const handleToggleMenu = () => {
    setOpenMenu((prev) => !prev);
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
    getProfileData();
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
        zIndex: 3,
        boxShadow: 0,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <TooltipIconButton
          title={openMenu ? "Закрыть меню" : "Открыть меню"}
          aria-label={openMenu ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={openMenu}
          onClick={handleToggleMenu}
          sx={{ p: 0, color: "inherit", display: { xs: "inline-flex", sm: "none" } }}
        >
          <MenuIcon
            sx={{
              transform: openMenu ? "rotate(90deg)" : "rotate(0)",
              transition: "0.2s",
              fontSize: "2rem",
              display: {
                xs: "block",
                sm: "none",
              },
              cursor: "pointer",
            }}
          />
        </TooltipIconButton>
        <Box
          component="img"
          src={logo}
          alt="Driver"
          sx={{
            height: 32,
            width: "auto",
            maxWidth: 150,
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <NotificationsBlock />

        <ActionTooltip title="Открыть меню профиля">
        <Button
          variant="outlined"
          onClick={handleOpenProfileMenu}
          aria-label="Открыть меню профиля"
          sx={{
            borderColor: "primary.main",
            display: "flex",
            gap: 1,
            width: "fit-content",
            textTransform: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            borderRadius: 2,
            px: {
              xs: 0,
              sm: 1,
            },
          }}
        >
          <Avatar
            src={profileData?.avatar || undefined}
            sx={{
              width: {
                xs: 24,
                sm: 28,
              },
              height: {
                xs: 24,
                sm: 28,
              },

              fontSize: 13,
              flexShrink: 0,
            }}
          />
          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "inline",
              },
              color: "primary.main",
            }}
          >
            {userEmail}
          </Typography>
        </Button>
        </ActionTooltip>
        <Menu
          anchorEl={profileAnchorEl}
          open={isProfileMenuOpen}
          onClose={handleCloseProfileMenu}
          slotProps={{
            paper: {
              sx: {
                width: profileAnchorEl?.offsetWidth,
              },
            },
          }}
        >
          <MenuItem
            onClick={handleNavigateProfile}
            sx={{
              py: 0.9,
              fontSize: "1.rem",
              color: "#172B4D",
              fontWeight: 500,
              textTransform: "none",
              textAlign: "center",
            }}
          >
            Профиль
          </MenuItem>

          <MenuItem
            sx={{
              py: 0.9,
              fontSize: "1.rem",
              color: "#172B4D",
              fontWeight: 500,
              textTransform: "none",
              textAlign: "center",
            }}
          >
            Настройки
          </MenuItem>

          <MenuItem onClick={() => {
            handleCloseProfileMenu();
            navigate("/complaints");
          }}>
            Жалобы
          </MenuItem>

          <MenuItem
            onClick={handleOpenLogoutModal}
            sx={{
              py: 0.9,
              fontSize: "1.rem",
              color: "#172B4D",
              fontWeight: 500,
              textTransform: "none",
              textAlign: "center",
            }}
          >
            Выход
          </MenuItem>
        </Menu>

        {isLogoutModalOpen && (
          <LogoutModal
            open={isLogoutModalOpen}
            handleOpenModal={handleCloseLogoutModal}
            handleCloseProfile={handleCloseProfileMenu}
          />
        )}
      </Box>
    </AppBar>
  );
};

export default Header;
