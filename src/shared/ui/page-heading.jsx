import { Box, Typography } from "@mui/material";

const PageHeading = ({ title, description }) => {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "1.5rem",
          сolor: "font_color.heading",
        }}
      >
        {title}
      </Typography>

      <Typography color="text.secondary" fontSize={14}>
        {description}
      </Typography>
    </Box>
  );
};

export default PageHeading;
