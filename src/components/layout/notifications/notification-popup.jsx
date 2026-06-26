import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { NavLink } from "react-router-dom";
import Loader from "../loader";
import Section from "../../../shared/ui/section";
import RenderNotificationType from "../../../shared/ui/render-notification-type";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LocalPostOfficeOutlinedIcon from "@mui/icons-material/LocalPostOfficeOutlined";
import InfoField from "../../../shared/ui/info-field";
import CustomNavLink from "../../../shared/ui/custom-nav-link";
import { Link as RouterLink } from "react-router-dom";

const NotificationPopup = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const notificationDetails = useNotificationsStore(
    (state) => state.notificationDetails,
  );
  const getNotificationDetails = useNotificationsStore(
    (state) => state.getNotificationDetails,
  );

  const handleNotificationPopupClose = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    getNotificationDetails(selectedNotification.id);
  }, []);

  if (!notificationDetails) return <Loader />;

  return (
    <Dialog
      open={!!selectedNotification}
      onClose={handleNotificationPopupClose}
      fullWidth
      maxWidth="sm"
      sx={{
        p: 5,
      }}
    >
      <DialogTitle>{selectedNotification?.theme}</DialogTitle>

      <DialogContent>
        <Section
          icon={<NotificationsNoneOutlinedIcon color="primary" />}
          title={<RenderNotificationType type={selectedNotification?.type} />}
        >
          <InfoField
            accent
            value={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <LocalPostOfficeOutlinedIcon />
                <Typography>{notificationDetails?.message}</Typography>
                <Button
                  onClick={handleNotificationPopupClose}
                  sx={{ display: "block", ml: "auto" }}
                  component={RouterLink}
                  to={notificationDetails?.link}
                  variant="contained"
                >
                  Перейти
                </Button>
              </Box>
            }
          />
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
