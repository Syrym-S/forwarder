import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

const InfoField = ({ label, value, accent = false }) => { const { t } = useTranslation(); return (<Box
    sx={{
      py: 0.5,
      px: 1.5,
      border: "1px solid",
      borderColor: accent ? "primary.main" : "divider",
      borderRadius: 4,
      bgcolor: accent ? "rgba(33,150,243,.04)" : "background.default",
    }}
  >
    <Typography
      variant="caption"
      sx={{
        color: "color.slate",
      }}
      display="block"
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontWeight: 600,
        color: "primary.main",
      }}
    >
      {value || t("ui.not_specified_2")}
    </Typography>
  </Box>); };

export default InfoField;
