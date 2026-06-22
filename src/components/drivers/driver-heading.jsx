import { Box, Stack, Typography } from "@mui/material";

const DriverHeading = ({ driver }) => {
  return (
    <Box
      spacing={0.5}
      sx={{
        display: "flex",
        alignItems: {
          xs: "start",
          sm: "center",
        },
        gap: "10px",
        justifyContent: "space-between",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Stack>
          <Typography variant="h5" fontWeight={700}>
            Информация о лиде
          </Typography>

          <Typography
            sx={{
              color: "color.slate",
            }}
          >
            {driver?.fio}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default DriverHeading;
