import { Box, Skeleton, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const NotificationState = ({ loading }) => loading ? (
  <Box role="status" aria-label="Загрузка уведомлений" sx={{ p: 2, display: "grid", gap: 1.5 }}>
    {[0, 1, 2].map((item) => <Skeleton key={item} variant="rounded" height={100} sx={{ borderRadius: 2.5 }} />)}
  </Box>
) : (
  <Box sx={{ px: 3, py: 6, textAlign: "center" }}>
    <Box sx={{ mx: "auto", mb: 2, width: 64, height: 64, borderRadius: "50%", bgcolor: "background.main", color: "primary.main", display: "grid", placeItems: "center" }}>
      <NotificationsNoneOutlinedIcon sx={{ fontSize: 30 }} />
    </Box>
    <Typography sx={{ fontWeight: 600, color: "font_color.heading" }}>Уведомлений пока нет</Typography>
    <Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>Здесь появятся события по вашим перевозкам и аукционам</Typography>
  </Box>
);
export default NotificationState;
