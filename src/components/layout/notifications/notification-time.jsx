import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatNotificationTime } from "../../../shared/helpers/notifications/format-notification-time";

const NotificationTime = ({ createdAt }) => {
  const { i18n } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const time = formatNotificationTime(createdAt, i18n.resolvedLanguage, now);
  if (!time) return null;

  return (
    <Typography
      component="time"
      dateTime={time.dateTime}
      title={time.title}
      sx={{
        display: "block",
        mt: 0.75,
        fontSize: 11,
        lineHeight: 1.5,
        fontWeight: 400,
        color: "text.secondary",
      }}
    >
      {time.label}
    </Typography>
  );
};

export default NotificationTime;
