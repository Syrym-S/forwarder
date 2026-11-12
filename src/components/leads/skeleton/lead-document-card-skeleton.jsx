import { Box, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";

const LeadDocumentCardSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      aria-label={t("ui.loading_document")}
      aria-busy="true"
      sx={{
        p: 1.5,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.default",
      }}
    >
      <Box aria-hidden="true">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "42px minmax(0, 1fr) 24px",
            alignItems: "center",
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Skeleton animation="wave" variant="rounded" width={42} height={42} />
          <Box sx={{ minWidth: 0 }}>
            <Skeleton animation="wave" width="85%" height={18} />
            <Skeleton animation="wave" width="65%" height={18} />
            <Skeleton animation="wave" width="50%" height={16} />
          </Box>
          <Skeleton animation="wave" variant="rounded" width={24} height={24} />
        </Box>
        <Skeleton
          animation="wave"
          variant="rounded"
          height={150}
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
};

export default LeadDocumentCardSkeleton;
