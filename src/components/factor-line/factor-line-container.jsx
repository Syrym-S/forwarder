import { Box, CircularProgress } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import FactorLineTable from "./factor-line-table";
import FactoringLineCard from "./factor-line-card";
import { useFactorStore } from "../../app/store/factor/factor-store";
import PageLoader from "../../shared/ui/loaders/page-loader";

const FactorLineContainer = ({ view }) => {
  const factoringsLine = useFactorStore((state) => state.factoringsLine);
  const isLoading = useFactorStore((state) => state.isLoading);

  const isCardView = view === VIEWS.cards;
  const isTableView = view === VIEWS.table;

  if (isLoading) return <PageLoader />;

  return (
    <Box>
      {isCardView && (
        <Box
          sx={{
            width: "60%",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1,
            mx: "auto",
          }}
        >
          {factoringsLine.map((item) => (
            <FactoringLineCard line={item} />
          ))}
        </Box>
      )}
      {isTableView && <FactorLineTable factorLine={factoringsLine} />}
    </Box>
  );
};

export default FactorLineContainer;
