import { Box, Skeleton, Stack } from "@mui/material";

export const LeadCardSkeleton = () => {
  return (
    <Box
      aria-hidden="true"
      sx={{
        p: 3,
        minWidth: 0,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Skeleton animation="wave" width="50%" height={30} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "40%", alignItems: { xs: "flex-start", sm: "center" } }}
          >
            <Skeleton animation="wave" width="35%" height={30} />
            <Skeleton animation="wave" variant="rounded" width="60%" height={24} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton animation="wave" width="35%" height={18} />
            <Skeleton animation="wave" width="90%" height={20} />
          </Box>
          <Skeleton animation="wave" variant="circular" width={17} height={17} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton animation="wave" width="35%" height={18} />
            <Skeleton animation="wave" width="80%" height={20} />
          </Box>
        </Box>

        {[0, 1].map((index) => (
          <Box
            key={index}
            sx={{
              p: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
            }}
          >
            <Skeleton animation="wave" width="35%" height={20} />
            <Skeleton animation="wave" width="50%" height={20} />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
