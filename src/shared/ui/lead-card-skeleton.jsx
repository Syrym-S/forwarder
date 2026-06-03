import { Box, Skeleton, Stack } from "@mui/material";

export const LeadCardSkeleton = () => {
  return (
    <Box
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Skeleton width={80} height={20} />
            <Skeleton width={180} height={30} />
          </Box>

          <Box>
            <Skeleton width={90} height={32} />
            <Skeleton width={70} height={32} />
          </Box>
        </Box>

        <Skeleton variant="rounded" height={90} />
        <Skeleton variant="rounded" height={90} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
          <Skeleton variant="rounded" height={60} />
        </Box>
      </Stack>
    </Box>
  );
};
