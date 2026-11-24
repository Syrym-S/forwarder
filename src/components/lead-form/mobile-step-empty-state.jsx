import { Box, Typography, useMediaQuery } from "@mui/material";

const MobileStepEmptyState = ({ icon, title, description, detail }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  if (!isMobile) return null;

  return (
    <Box
      sx={{
        minHeight: "clamp(220px, 32dvh, 300px)",
        boxSizing: "border-box",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          bgcolor: "rgba(33, 150, 243, 0.08)",
          color: "primary.main",
          "& .MuiSvgIcon-root": { fontSize: 30 },
        }}
      >
        {icon}
      </Box>
      <Typography component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography sx={{ maxWidth: 280, fontSize: 13, lineHeight: 1.6, color: "text.secondary" }}>
        {description}
      </Typography>
      {detail && (
        <Typography sx={{ maxWidth: 280, mt: 0.5, fontSize: 12, lineHeight: 1.5, color: "text.secondary" }}>
          {detail}
        </Typography>
      )}
    </Box>
  );
};

export default MobileStepEmptyState;
