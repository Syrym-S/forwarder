import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LeadCardSkeleton } from "./lead-card-skeleton";

const CardListSkeleton = ({ count = 3, sx = {} }) => {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      aria-label={t("ui.loading")}
      aria-busy="true"
      sx={{
        width: { xs: "100%", sm: "60%" },
        mx: "auto",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 5,
        my: "10px",
        ...sx,
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <LeadCardSkeleton key={index} />
      ))}
    </Box>
  );
};

export default CardListSkeleton;
