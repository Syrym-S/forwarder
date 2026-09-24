import { Box, Paper, Typography } from "@mui/material";

const Section = ({ icon, title, children }) => (
  <Paper
    elevation={0}
    sx={{
      boxShadow: "none",
      minWidth: 0,
      "& .MuiTypography-root": { overflowWrap: "anywhere" },
      "& .MuiButton-root": { textTransform: "none", borderRadius: 2 },
      p: { xs: 2, sm: 2.5 },
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      mb: 2,
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
          flexShrink: 0,
          borderRadius: 2,
          bgcolor: "background.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 600,
          color: "font_color.heading",
          fontSize: 16,
        }}
      >
        {title}
      </Typography>
    </Box>

    {children}
  </Paper>
);

export default Section;
