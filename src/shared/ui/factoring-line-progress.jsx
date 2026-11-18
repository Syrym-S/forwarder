import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { renderLineColor } from "../helpers/factoring/render-progress-line-color";

const FactoringLineProgress = ({ percent }) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={0.75} sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Typography variant="body2" color="text.secondary">{t("ui.used")}</Typography>
        <Typography variant="body2" fontWeight={600}>{percent}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(100, percent)}
        aria-label={t("ui.used")}
        aria-valuetext={`${percent}%`}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": {
            backgroundColor: renderLineColor(percent),
            borderRadius: 4,
          },
        }}
      />
    </Stack>
  );
};

export default FactoringLineProgress;
