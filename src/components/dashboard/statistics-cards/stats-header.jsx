import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

const StatsHeader = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "1.5rem", md: "1.75rem" },
          fontWeight: 600,
          color: "font_color.heading",
          letterSpacing: "-0.025em",
        }}
      >
        {t("dashboard.statistics")}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>
        {t("dashboard.statistics_description")}
      </Typography>
    </Box>
  );
};
export default StatsHeader;
