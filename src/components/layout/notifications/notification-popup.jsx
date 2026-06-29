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
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "calc(100% - 6px)",
              sm: "100%",
            },
            m: {
              xs: 0,
              sm: 2,
            },
          },
        },
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
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <LocalPostOfficeOutlinedIcon />
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.8rem",
                        sm: "0.9rem",
                      },
                    }}
                  >
                    {notificationDetails?.message}
                  </Typography>
                </Box>
                <Button
                  onClick={handleNotificationPopupClose}
                  sx={{
                    display: "block",
                    ml: "auto",
                    width: {
                      xs: "100%",
                      sm: "fit-content",
                    },
                    textAlign: "center",
                  }}
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
