import {
  Box,
  Button,
  CircularProgress,
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
import NotificationLoader from "../../../shared/ui/loaders/notification-loader";

const NotificationPopup = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const getNotificationPopUpLeadItem = useLeadsStore(
    (state) => state.getNotificationPopUpLeadItem,
  );
  const isLoadLoading = useLeadsStore((state) => state.isLoadLoading);
  const isUnloadLoading = useLeadsStore((state) => state.isUnloadLoading);
  const verifyCargo = useLeadsStore((state) => state.verifyCargo);
  const rejectCargo = useLeadsStore((state) => state.rejectCargo);
  const verifyCargoUnload = useLeadsStore((state) => state.verifyCargoUnload);
  const rejectCargoUnload = useLeadsStore((state) => state.rejectCargoUnload);
  const notificationDetails = useNotificationsStore(
    (state) => state.notificationDetails,
  );
  const getNotificationDetails = useNotificationsStore(
    (state) => state.getNotificationDetails,
  );
  const isNotificationDetailsLoading = useNotificationsStore(
    (state) => state.isNotificationDetailsLoading,
  );
  const clearNotificationPopUpCurrentLead = useNotificationsStore(
    (state) => state.clearNotificationPopUpCurrentLead,
  );

  const { id, notification_type } = parserNotificationType(
    notificationDetails?.type || "",
  );

  const handleNotificationPopupClose = () => {
    setSelectedNotification(null);
    clearNotificationPopUpCurrentLead();
  };

  const handleVerifyCargoLoad = async () => {
    await verifyCargo(id);
    await getNotificationPopUpLeadItem(id);
  };

  const handleRejectCargoLoad = async () => {
    await rejectCargo(id);
    await getNotificationPopUpLeadItem(id);
    await getLeadItem(id);
  };

  const handleVerifyCargoUnload = async () => {
    await verifyCargoUnload(id);
    await getNotificationPopUpLeadItem(id);
  };

  const handleRejectCargoUnload = async () => {
    await rejectCargoUnload(id);
    await getNotificationPopUpLeadItem(id);
  };

  const loadCargoActions = currentLead?.cargo_actions[0];
  const unloadCargoActions = currentLead?.cargo_actions[1];

  const newCargoActionFiles =
    currentLead?.cargo_actions[currentLead?.cargo_actions.length - 1].files;

  const isLoadVerified = loadCargoActions?.is_verified;
  const isUnloadVerified = unloadCargoActions?.is_verified;

  useEffect(() => {
    getNotificationDetails(selectedNotification.id);
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.shipping) {
      getNotificationPopUpLeadItem(id);
    }
  }, [id]);

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
      <DialogTitle>
        {isNotificationDetailsLoading
          ? "Загрузка..."
          : selectedNotification?.theme}
      </DialogTitle>

      <DialogContent>
        {isNotificationDetailsLoading ? (
          <Section>
            <NotificationLoader />
          </Section>
        ) : (
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

            {newCargoActionFiles && (
              <>
                <Box
                  sx={{
                    py: 1,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(1,1fr)",
                      sm: "repeat(2,1fr)",
                      md: "repeat(3,1fr)",
                    },
                    gap: 1,
                  }}
                >
                  {newCargoActionFiles.map((file) => (
                    <LeadDocumentCard document={file} />
                  ))}
                </Box>
                {/* <Box
                  sx={{
                    my: 1,
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <Button
                    disabled={isLoadLoading}
                    color="success"
                    variant="outlined"
                    onClick={handleVerifyCargoLoad}
                  >
                    {isLoadLoading ? "Идет подтверждение" : "Подтвердить"}
                  </Button>
                  <Button
                    disabled={isLoadLoading}
                    color="error"
                    variant="outlined"
                    onClick={handleRejectCargoLoad}
                  >
                    Отклонить
                  </Button>
                </Box> */}
              </>
            )}
            {/* {action === "loading_started" &&
              (isLoading ? (
                <Box
                  sx={{
                    height: "15vh",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box
                    p={1}
                    sx={{
                      py: 1,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1,1fr)",
                        sm: "repeat(2,1fr)",
                        md: "repeat(3,1fr)",
                      },
                      gap: 1,
                    }}
                  >
                    {loadCargoActions?.files?.map((file) => (
                      <LeadDocumentCard document={file} />
                    ))}
                  </Box>
                  {!isLoadVerified && loadCargoActions && (
                    <Box
                      sx={{
                        my: 1,
                        display: "flex",
                        gap: 5,
                      }}
                    >
                      <Button
                        disabled={isLoadLoading}
                        color="success"
                        variant="outlined"
                        onClick={handleVerifyCargoLoad}
                      >
                        {isLoadLoading ? "Идет подтверждение" : "Подтвердить"}
                      </Button>
                      <Button
                        disabled={isLoadLoading}
                        color="error"
                        variant="outlined"
                        onClick={handleRejectCargoLoad}
                      >
                        Отклонить
                      </Button>
                    </Box>
                  )}
                </>
              ))} */}

            {/* {action === "unloading_started" &&
              (isLoading ? (
                <Box
                  sx={{
                    height: "15vh",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box
                    p={1}
                    sx={{
                      py: 1,
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1,1fr)",
                        sm: "repeat(2,1fr)",
                        md: "repeat(3,1fr)",
                      },
                      gap: 1,
                    }}
                  >
                    {unloadCargoActions?.files?.map((file) => (
                      <LeadDocumentCard document={file} />
                    ))}
                  </Box>

                  {!isUnloadVerified && unloadCargoActions && (
                    <Box
                      sx={{
                        my: 1,
                        display: "flex",
                        gap: 5,
                      }}
                    >
                      <Button
                        disabled={isUnloadLoading}
                        color="success"
                        variant="outlined"
                        onClick={handleVerifyCargoUnload}
                      >
                        {isUnloadLoading ? "Идет подтверждение" : "Подтвердить"}
                      </Button>
                      <Button
                        disabled={isUnloadLoading}
                        color="error"
                        variant="outlined"
                        onClick={handleRejectCargoUnload}
                      >
                        Отклонить
                      </Button>
                    </Box>
                  )}
                </>
              ))} */}
          </Section>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPopup;
