import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useTranslation } from "react-i18next";
import { formatNotificationTime } from "../../../shared/helpers/notifications/format-notification-time";

const NotificationTime = ({ createdAt }) => {
  const { t, i18n } = useTranslation();
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
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        columnGap: 0.75,
        rowGap: 0.25,
        mt: 1,
        fontSize: 12,
        lineHeight: 1.5,
        fontWeight: 500,
        color: "text.secondary",
      }}
    >
      <AccessTimeRoundedIcon sx={{ fontSize: 14, flexShrink: 0 }} />
      <Box component="bdi" sx={{ whiteSpace: "nowrap" }}>
        {time.dayKey ? t(time.dayKey) : time.dateLabel}
      </Box>
      <Box component="span" aria-hidden="true" sx={{ opacity: 0.6 }}>
        ·
      </Box>
      <Box
        component="bdi"
        sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
      >
        {time.timeLabel}
      </Box>
    </Typography>
  );
};

export default NotificationTime;
