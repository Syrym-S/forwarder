import { Dialog, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";

const NotificationPopup = ({
  selectedNotification,
  setSelectedNotification,
}) => {
  const getNotificationDetails = useNotificationsStore(
    (state) => state.getNotificationDetails,
  );

  useEffect(() => {
    getNotificationDetails(selectedNotification.id);
  }, []);

  return (
    <Dialog
      open={!!selectedNotification}
      onClose={() => setSelectedNotification(null)}
      fullWidth
      maxWidth="sm"
      sx={{
        p: 5,
      }}
    >
      <DialogTitle>{selectedNotification?.theme}</DialogTitle>
    </Dialog>
  );
};

export default NotificationPopup;
