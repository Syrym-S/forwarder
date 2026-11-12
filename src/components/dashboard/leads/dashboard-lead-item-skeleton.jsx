import { Box, Divider, Paper, Skeleton, Stack } from "@mui/material";

const DashboardLeadItemSkeleton = () => (
  <Paper
    aria-hidden="true"
    variant="outlined"
    sx={{ p: 1.5, borderRadius: 3 }}
  >
    <Stack spacing={1.25}>
      <Stack spacing={0.75} alignItems="flex-start">
        <Skeleton animation="wave" variant="rounded" width={100} height={24} />
        <Skeleton animation="wave" variant="rounded" width={140} height={24} />
      </Stack>

      <Box>
        <Skeleton animation="wave" width="25%" height={20} />
        <Skeleton animation="wave" width="85%" height={20} />
      </Box>

      <Divider />

      <Box>
        <Skeleton animation="wave" width="25%" height={20} />
        <Skeleton animation="wave" width="75%" height={20} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Skeleton animation="wave" width="45%" height={20} />
        <Skeleton animation="wave" width="45%" height={20} />
      </Box>
      <Skeleton animation="wave" variant="rounded" width={110} height={30} />
    </Stack>
  </Paper>
);

export default DashboardLeadItemSkeleton;
