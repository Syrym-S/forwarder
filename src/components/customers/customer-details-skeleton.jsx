import { Box, Paper, Skeleton } from "@mui/material";

const CustomerDetailsSkeleton = () => (
  <>
    <Box
      aria-hidden="true"
      sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        overflow: "hidden",
        borderRight: { md: "1px solid" },
        borderBottom: { xs: "1px solid", md: 0 },
        borderColor: { xs: "divider", md: "divider" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          pr: { xs: 4, md: 0 },
        }}
      >
        <Skeleton
          animation="wave"
          variant="circular"
          width={72}
          height={72}
          sx={{ flexShrink: 0 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Skeleton animation="wave" width="45%" height={18} />
          <Skeleton animation="wave" width="90%" height={28} />
          <Skeleton animation="wave" width="75%" height={20} />
        </Box>
      </Box>
      {[6, 8].map((count) => (
        <Paper key={count} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
          <Skeleton animation="wave" width="75%" height={24} sx={{ mb: 1.5 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1,
            }}
          >
            {Array.from({ length: count }, (_, index) => (
              <Box
                key={index}
                sx={{
                  p: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2.5,
                }}
              >
                <Skeleton animation="wave" width="65%" height={16} />
                <Skeleton animation="wave" width="90%" height={24} />
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
    <Box
      aria-hidden="true"
      sx={{
        p: { xs: 2, sm: 3 },
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <Skeleton animation="wave" width={160} height={32} />
      <Box
        sx={{ flex: { xs: "none", md: 1 }, minHeight: 0, overflow: "hidden" }}
      >
        <Box sx={{ display: "grid", gap: 2 }}>
          {Array.from({ length: 3 }, (_, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3 }}
            >
              <Skeleton
                animation="wave"
                width="60%"
                height={28}
                sx={{ mx: "auto" }}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 1,
                  my: 1.5,
                }}
              >
                {Array.from({ length: 3 }, (_, column) => (
                  <Box key={column}>
                    <Skeleton
                      animation="wave"
                      width="70%"
                      height={16}
                      sx={{ mx: "auto" }}
                    />
                    <Skeleton
                      animation="wave"
                      width="80%"
                      height={20}
                      sx={{ mx: "auto" }}
                    />
                  </Box>
                ))}
              </Box>
              <Skeleton
                animation="wave"
                variant="rounded"
                width="45%"
                height={28}
                sx={{ mx: "auto", mb: 1 }}
              />
              <Skeleton
                animation="wave"
                width="30%"
                height={20}
                sx={{ mx: "auto" }}
              />
            </Paper>
          ))}
        </Box>
      </Box>
      <Skeleton
        animation="wave"
        variant="rounded"
        width={230}
        height={36}
        sx={{ alignSelf: "center", maxWidth: "100%", flexShrink: 0 }}
      />
    </Box>
  </>
);

export default CustomerDetailsSkeleton;
