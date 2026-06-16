import { Box, Typography } from "@mui/material";

const InfoField = ({ label, value, accent = false }) => (
  <Box
    sx={{
      p: 1.5,
      border: "1px solid",
      borderColor: accent ? "primary.main" : "divider",
      borderRadius: 2,
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
        fontWeight: accent ? 600 : 400,
        color: "color.slate_2",
      }}
    >
      {value || "Не указано"}
    </Typography>
  </Box>
);

export default InfoField;
