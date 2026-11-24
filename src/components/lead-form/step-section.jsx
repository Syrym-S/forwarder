import { Box, Typography } from "@mui/material";

export function StepSection({ title, children }) {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: {
          xs: 0,
          sm: 3,
        },
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 600,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}
