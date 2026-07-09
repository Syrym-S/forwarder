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
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";
import { LeadDocumentCard } from "../../leads/documents/LeadDocumentCard";
import { STATUS } from "../../../shared/const/tenders";
import PageLoader from "../../../shared/ui/loaders/page-loader";

const NotificationPopup = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const notificationDetails = useNotificationsStore(
    (state) => state.notificationDetails,
  );
  const getNotificationDetails = useNotificationsStore(
    (state) => state.getNotificationDetails,
  );
  const isNotificationDetailsLoading = useNotificationsStore(
    (state) => state.isNotificationDetailsLoading,
  );

  const handleNotificationPopupClose = () => {
    setSelectedNotification(null);
  };

  const { id, notification_type, action } = parserNotificationType(
    notificationDetails?.type || "",
  );

  console.log(action === STATUS.start_unloading);
  console.log("action", action);
  console.log("STATUS.start_unloading", STATUS.start_unloading);

  const loadCargoActions = currentLead?.cargo_actions[0];
  const unloadCargoActions = currentLead?.cargo_actions[1];

  useEffect(() => {
    getNotificationDetails(selectedNotification.id);
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.lead) {
      getLeadItem(id);
    }
  }, [id]);

  if (isNotificationDetailsLoading)
    return (
      <Dialog
        open={!!selectedNotification}
        onClose={handleNotificationPopupClose}
        fullWidth
        maxWidth="md"
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
        <PageLoader />
      </Dialog>
    );

  return (
    <Dialog
      open={!!selectedNotification}
      onClose={handleNotificationPopupClose}
      fullWidth
      maxWidth="md"
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
          {action === "loading_started" && (
            <Box
              p={1}
              sx={{
                py: 1,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 1,
              }}
            >
              {loadCargoActions?.files?.map((file) => (
                <LeadDocumentCard document={file} />
              ))}
            </Box>
          )}

          {action === "unloading_started" && (
            <Box
              p={1}
              sx={{
                py: 1,
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 1,
              }}
            >
              {unloadCargoActions?.files?.map((file) => (
                <LeadDocumentCard document={file} />
              ))}
            </Box>
          )}
        </Section>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
