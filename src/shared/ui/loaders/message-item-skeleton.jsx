import { Box, Skeleton } from "@mui/material";

const MessageItemSkeleton = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        alignItems: "flex-end",
      }}
    >
      <Box
        sx={{
          width: 220,
          maxWidth: "70%",
          px: 2,
          py: 1.5,
          borderRadius: "16px 0px 16px 16px",
          bgcolor: "grey.100",
        }}
      >
        <Skeleton variant="text" width="100%" height={24} animation="wave" />

        <Skeleton variant="text" width="75%" height={24} animation="wave" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
          }}
        >
          <Skeleton variant="text" width={90} height={16} animation="wave" />
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItemSkeleton;
