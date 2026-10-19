import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const EmptyInfo = ({ label = "Данные", subLabel = "Доп Информация" }) => (
  <Box
    sx={{
      border: "1px solid",
      borderColor: "divider",
      minHeight: 180,
      height: "80%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      p: 3,
      borderRadius: 2,
      bgcolor: "action.hover",
      color: "text.secondary",
      textAlign: "center",
    }}
  >
    <InfoOutlinedIcon
      color="primary"
      sx={{
        fontSize: 36,
        opacity: 0.6,
      }}
    />

    <Typography variant="body1" fontWeight={500}>
      {label}
    </Typography>

    <Typography variant="body2" color="text.disabled">
      {subLabel}
    </Typography>
  </Box>
);

export default EmptyInfo;
