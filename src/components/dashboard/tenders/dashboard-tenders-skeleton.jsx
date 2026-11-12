import { Box, Divider, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

const DashboardTendersSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Stack
      spacing={2}
      role="status"
      aria-label={t("ui.loading")}
      aria-busy="true"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Box
          key={index}
          aria-hidden="true"
          sx={{
            p: 1.5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
          }}
        >
          <Stack spacing={1.25}>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {[140, 100, 100].map((width, chipIndex) => (
                <Skeleton
                  key={chipIndex}
                  animation="wave"
                  variant="rounded"
                  width={width}
                  height={24}
                  sx={{ maxWidth: "100%" }}
                />
              ))}
            </Box>
            <Skeleton animation="wave" variant="rounded" width={100} height={24} />

            <Box>
              <Skeleton animation="wave" width="25%" height={20} />
              <Skeleton animation="wave" width="85%" height={20} />
            </Box>

            <Divider />

            <Box>
              <Skeleton animation="wave" width="25%" height={20} />
              <Skeleton animation="wave" width="75%" height={20} />
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default DashboardTendersSkeleton;
