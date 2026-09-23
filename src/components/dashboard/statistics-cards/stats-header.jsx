import { Box, Typography } from "@mui/material";

const StatsHeader = () => (
  <Box>
    <Typography component="h2" sx={{ fontSize: { xs: "1.5rem", md: "1.75rem" }, fontWeight: 600, color: "font_color.heading", letterSpacing: "-0.025em" }}>
      Статистика
    </Typography>
    <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
      Показатели перевозок и факторинга
    </Typography>
  </Box>
);

export default StatsHeader;
