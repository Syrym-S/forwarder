import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link as RouterLink } from "react-router-dom";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import RenderNotificationType from "../../../shared/ui/render-notification-type";
import RenderNotificationIcon from "../../../shared/ui/render-notification-icon";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";
import { LeadDocumentCard } from "../../leads/documents/LeadDocumentCard";
import NotificationLoader from "../../../shared/ui/loaders/notification-loader";

const NotificationPopup = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const currentLead = useLeadsStore(
    (state) => state.notificationPopUpCurrentLead,
  );
  const getLead = useLeadsStore((state) => state.getNotificationPopUpLeadItem);
  const clearLead = useLeadsStore(
    (state) => state.clearNotificationPopUpCurrentLead,
  );
  const {
    notificationDetails,
    getNotificationDetails,
    getNotifications,
    isNotificationDetailsLoading,
    error,
  } = useNotificationsStore();
  const { id, notification_type } = parserNotificationType(
    selectedNotification?.type || "",
  );
  const files =
    notification_type === NOTIFICATION_TYPE.shipping
      ? currentLead?.cargo_actions?.at(-1)?.files || []
      : [];

  const handleClose = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    getNotificationDetails(selectedNotification.id);
    return () => {
      getNotifications();
    };
  }, [selectedNotification.id, getNotificationDetails, getNotifications]);

  useEffect(() => {
    clearLead();
    if (notification_type === NOTIFICATION_TYPE.shipping && id) getLead(id);
    return () => clearLead();
  }, [id, notification_type, getLead, clearLead]);

  return (
    <Dialog
      open={!!selectedNotification}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="notification-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            m: 2,
            width: "calc(100% - 32px)",
            maxHeight: "calc(100dvh - 32px)",
          },
        },
      }}
    >
      <DialogTitle
        id="notification-dialog-title"
        sx={{
          p: 3,
          pr: 7,
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "font_color.heading",
          fontSize: 20,
          fontWeight: 600,
          overflowWrap: "anywhere",
        }}
      >
        {selectedNotification?.theme || "Уведомление"}
      </DialogTitle>
      <IconButton
        aria-label="Закрыть уведомление"
        onClick={handleClose}
        sx={{ position: "absolute", right: 12, top: 16 }}
      >
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent sx={{ p: 3, "&.MuiDialogContent-root": { pt: 3 } }}>
        {isNotificationDetailsLoading ? (
          <NotificationLoader />
        ) : error ? (
          <Alert severity="error">
            Не удалось загрузить уведомление. Закройте окно и попробуйте ещё
            раз.
          </Alert>
        ) : (
          <>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  bgcolor: "background.main",
                  color: "primary.main",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <RenderNotificationIcon
                  type={selectedNotification?.type || ""}
                />
              </Box>
              <Box
                sx={{
                  color: "font_color.heading",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                <RenderNotificationType
                  type={selectedNotification?.type || ""}
                />
              </Box>
            </Box>
            <Typography
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                fontSize: 14,
                lineHeight: 1.8,
                color: "text.secondary",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {notificationDetails?.message || selectedNotification?.message}
            </Typography>
            {files.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    mb: 1.5,
                    fontWeight: 600,
                    fontSize: 14,
                    color: "font_color.heading",
                  }}
                >
                  Документы
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {files.map((file, index) => (
                    <LeadDocumentCard
                      key={file.id || file.url || index}
                      document={file}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Закрыть
        </Button>
        {!isNotificationDetailsLoading &&
          !error &&
          notificationDetails?.link && (
            <Button
              component={RouterLink}
              to={notificationDetails.link}
              onClick={handleClose}
              variant="contained"
              disableElevation
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Перейти
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};
export default NotificationPopup;
