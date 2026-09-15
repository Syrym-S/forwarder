import { Box } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import FactorLineTable from "./factor-line-table";
import FactoringLineCard from "./factor-line-card";
import { useFactorStore } from "../../app/store/factor/factor-store";
import DataContainer from "../../shared/ui/data-container";

const FactorLineContainer = ({ view }) => {
  const factoringsLine = useFactorStore((state) => state.factoringsLine);
  const isLoading = useFactorStore((state) => state.isLoading);

  const isFactoringsLineEmpty = factoringsLine.length === 0;

  const isCardView = view === VIEWS.cards;
  const isTableView = view === VIEWS.table;

  return (
    <Box
      sx={{
        width: isCardView ? "60%" : "100%",
        mx: "auto",
      }}
    >
      <DataContainer
        isLoading={isLoading}
        isEmpty={isFactoringsLineEmpty}
        emptyText="Список факторинг линий пуст"
      >
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
      </DataContainer>
    </Box>
  );
};

export default FactorLineContainer;
