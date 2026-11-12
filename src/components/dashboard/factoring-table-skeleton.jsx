import { Box, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const FactoringTableSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      aria-label={t("ui.loading")}
      aria-busy="true"
      sx={{ height: 420, minWidth: 0, overflow: "auto" }}
    >
      <Box aria-hidden="true" sx={{ minWidth: 2450 }}>
        {Array.from({ length: 4 }, (_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "grid",
              gridTemplateColumns: "50px repeat(12, 200px)",
              alignItems: "center",
              height: rowIndex === 0 ? 56 : 70,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: rowIndex % 2 === 0 ? "background.default" : "background.paper",
            }}
          >
            <Skeleton
              animation="wave"
              variant="rounded"
              width={18}
              height={18}
              sx={{ mx: "auto" }}
            />
            {Array.from({ length: 12 }, (_, columnIndex) => (
              <Box key={columnIndex} sx={{ px: 1.25 }}>
                <Skeleton
                  animation="wave"
                  width={rowIndex === 0 ? "55%" : "75%"}
                  height={24}
                />
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FactoringTableSkeleton;
