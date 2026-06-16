import { Box, Paper, Typography } from "@mui/material";

const Section = ({ icon, title, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      mb: 3,
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          bgcolor: "background.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography fontWeight={600}>{title}</Typography>
    </Box>

    {children}
  </Paper>
);

export default Section;
