import { useTranslation } from "react-i18next";
import { Alert, Box, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import FactoringLineRingProgress from "./factoring-line-ring-progress";
import FactoringLineSkeleton from "./factoring-line-skeleton";
import { STATUS } from "../../../shared/const/tenders";

const FactoringProgressBarContainer = () => {
  const { t } = useTranslation();
  const factoringsLine = useFactorStore((state) => state.factoringsLine);
  const isLoading = useFactorStore((state) => state.isLoading);
  const getFactoringsLine = useFactorStore((state) => state.getFactoringsLine);

  const approvedLines = factoringsLine?.filter(
    (line) => line.status === STATUS.approved,
  );

  const isEmpty = approvedLines.length === 0;

  useEffect(() => {
    getFactoringsLine();
  }, []);

  return (
    <Paper elevation={0} variant="outlined"
      sx={{
        width: "100%",
        boxSizing: "border-box",
        borderRadius: 3,
        px: 2,
        pb: 2,
        height: "fit-content",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: 2,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 600,
            color: "font_color.heading",
          }}
        >
          {t("dashboard.confirmed_factoring_lines")}
        </Typography>
      </Box>
      <Box
        role={isLoading ? "status" : undefined}
        aria-label={isLoading ? t("ui.loading") : undefined}
        aria-busy={isLoading}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
          overflow: "hidden",
          overflowY: "auto",
          gap: 2,
        }}
      >
        {isLoading ? (
          <FactoringLineSkeleton />
        ) : (
          <>
            {isEmpty && <Alert severity="info">{t("dashboard.list_empty")}</Alert>}
            {approvedLines.map((line) => (
              <FactoringLineRingProgress key={line.id} line={line} />
            ))}
          </>
        )}
      </Box>
    </Paper>
  );
};

export default FactoringProgressBarContainer;
