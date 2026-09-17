import { Box, Typography } from "@mui/material";

const InfoItem = ({ label, value, color }) => {
  const isError = color === "error";

  return (
    <Box
      sx={{
        p: 1,
        border: "1px solid",
        borderColor: isError ? "error.main" : "divider",
        backgroundColor: isError ? "rgba(211, 47, 47, 0.05)" : "transparent",
        borderRadius: 2.5,
        minWidth: 0,
      }}
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
        {value ?? "Не указано"}
      </Typography>
    </Box>
  );
};

export default InfoItem;
