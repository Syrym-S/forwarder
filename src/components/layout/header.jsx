import { useState } from 'react';
import LogoutModal from './logout-modal';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './style.css';
import Box from '@mui/material/Box';
import { AppBar, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = ({ openMenu, setOpenMenu }) => {
   const [profileAnchorEl, setProfileAnchorEl] = useState(null);
   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
   const navigate = useNavigate();
   const isProfileMenuOpen = Boolean(profileAnchorEl);
   const userEmail = window?.APP_DATA?.user_email || 'Пользователь';

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
      navigate('/profile');
   };

   const handleOpenLogoutModal = () => {
      handleCloseProfileMenu();
      setIsLogoutModalOpen(true);
   };

   const handleCloseLogoutModal = () => {
      setIsLogoutModalOpen(false);
   };

   return (
      <AppBar
         position='sticky'
         display='flex'
         sx={{
            top: 0,
            left: 0,
            height: 56,
            color: '#000000',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            backgroundColor: 'background.default',
            zIndex: 2,
         }}
      >
         <MenuIcon
            sx={{
               transform: openMenu ? 'rotate(90deg)' : 'rotate(0)',
               transition: '0.2s',
               fontSize: '2rem',
               visibility: {
                  xs: 'visible',
                  sm: 'hidden',
               },
               cursor: 'pointer',
            }}
            onClick={handleToggleMenu}
         />

         <Box>
            <Button
               variant='outlined'
               startIcon={<AccountCircleIcon />}
               onClick={handleOpenProfileMenu}
               sx={{
                  maxWidth: {
                     xs: 180,
                     sm: 260,
                  },
                  textTransform: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
