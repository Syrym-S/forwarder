import { Box, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const LeadParticipantSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Box role="status" aria-label={t("ui.loading")} aria-busy="true">
      <Box aria-hidden="true">
        <Skeleton
          animation="wave"
          variant="rounded"
          width={170}
          height={42}
          sx={{ maxWidth: "100%", borderRadius: 2 }}
        />
        <Box
          sx={{
            py: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
            gap: 1.5,
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                minWidth: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
              }}
            >
              <Skeleton animation="wave" width="45%" height={20} />
              <Skeleton animation="wave" width="80%" height={24} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default LeadParticipantSkeleton;
