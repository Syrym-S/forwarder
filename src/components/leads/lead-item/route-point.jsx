import { Box, Chip, Typography } from "@mui/material";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const RoutePoint = ({ label, address, status, type }) => {
  const Icon = type === "from" ? TripOriginIcon : LocationOnOutlinedIcon;

  return (
    <Box
      sx={{
        width: "100%",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 5,
        backgroundColor: "rgb(250, 250, 250)",
      }}
    >
      {/* Верхняя строка */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 0.7,
        }}
      >
        <Typography
          sx={{
            fontSize: 10,
            color: "text.secondary",
          }}
        >
          {label}
        </Typography>

        <Chip
          label={status}
          size="small"
          variant="outlined"
          sx={{
            height: 28,
            fontWeight: 600,
            color: "text.secondary",
            fontSize: 12,
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          minWidth: 0,
        }}
      >
        <Icon
          sx={{
            fontSize: 14,
            color: "primary.main",
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 400,
            color: "text.primary",
            lineHeight: 1.4,

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {address || "Адрес не указан"}
        </Typography>
      </Box>
    </Box>
  );
};

export default RoutePoint;
