import { Alert, Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { VIEWS } from "../../shared/const/leads";
import DataContainer from "../../shared/ui/data-container";
import TableSkeleton from "../../shared/ui/table-skeleton";
import CardListSkeleton from "../../shared/ui/card-list-skeleton";
import FactorLineTable from "./factor-line-table";
import FactoringLineCard from "./factor-line-card";

const cardsLayout = {
  width: "100%",
  minWidth: 0,
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    xl: "repeat(2, minmax(0, 1fr))",
  },
  gap: 2,
  my: 0,
  mx: 0,
};

const FactorLineContainer = ({ view, lines, isLoading, error, onRetry }) => {
  const { t } = useTranslation();
  const isCardsView = view === VIEWS.cards;

  if (!isLoading && error) {
    return (
      <Alert
        severity="error"
        action={<Button color="inherit" onClick={onRetry}>{t("ui.retry")}</Button>}
      >
        {typeof error === "string" ? error : t("dashboard.loading_error")}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <DataContainer
        isLoading={isLoading}
        loadingFallback={isCardsView ? <CardListSkeleton sx={cardsLayout} /> : <TableSkeleton />}
        isEmpty={lines.length === 0}
        emptyText={t("ui.factoring_line_list_empty")}
      >
        {isCardsView ? (
          <Box sx={cardsLayout}>
            {lines.map((line) => <FactoringLineCard key={line.id} line={line} />)}
          </Box>
        ) : (
          <FactorLineTable lines={lines} />
        )}
      </DataContainer>
    </Box>
  );
};

export default FactorLineContainer;
