import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";

const InfoItem = ({ label, value, color, className = "", sx }) => {
  const { t } = useTranslation();
  const isError = color === "error";

  return (
    <Box
      className={`lead-info-field ${className}`.trim()}
      data-tone={color}
      sx={[theme => ({
        p: 1,
        border: "1px solid",
        borderColor: isError ? "error.main" : "divider",
        backgroundColor: isError ? "rgba(211, 47, 47, 0.05)" : "transparent",
        borderRadius: 2.5,
        minWidth: 0,
        [theme.breakpoints.down("sm")]: {
          ".lead-details-page &": {
            overflowWrap: "anywhere",
            "&:not([data-tone=\"error\"])": {
              padding: "10px",
              border: "0",
              borderRadius: "10px",
              background: "#f5f7fa"
            },
            "& > .MuiTypography-root:first-of-type": {
              marginBottom: "4px",
              fontSize: "11px",
              lineHeight: "1.35"
            },
            "& > .MuiTypography-root:last-of-type": {
              fontSize: "13px",
              lineHeight: "1.45"
            }
          }
        }
      }), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
    >
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 500,
          color: isError ? "error.main" : "text.secondary",
          mb: 0.3,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 500,
          color: isError ? "error.main" : "text.primary",
          lineHeight: 1.3,
        }}
      >
        {value ?? t("ui.not_specified_2")}
      </Typography>
    </Box>
  );
};

export default InfoItem;
