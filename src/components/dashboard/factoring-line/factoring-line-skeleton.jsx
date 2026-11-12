import { Box, Skeleton } from "@mui/material";

const FactoringLineSkeleton = () => (
  <Box
    aria-hidden="true"
    sx={{
      p: 2,
      minWidth: 0,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: "background.default",
    }}
  >
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        pb: 1,
        mb: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Skeleton animation="wave" width="45%" height={22} />
      <Skeleton animation="wave" width="30%" height={20} />
    </Box>
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <Skeleton
        animation="wave"
        variant="circular"
        width={140}
        height={140}
        sx={{ flexShrink: 0 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(4, minmax(0, 1fr))", md: "1fr" },
          gap: { xs: 2, md: 1.5 },
          width: { xs: "100%", md: 160 },
          maxWidth: "100%",
        }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Box key={index} sx={{ minWidth: 0 }}>
            <Skeleton animation="wave" width="80%" height={18} />
            <Skeleton animation="wave" width="100%" height={22} />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default FactoringLineSkeleton;
