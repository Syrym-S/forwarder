import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useFactorStore } from "../../../app/store/factor/factor-store";
import FactoringLineRingProgress from "./factoring-line-ring-progress";
import { STATUS } from "../../../shared/const/tenders";

const FactoringProgressBarContainer = () => {
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
          Подтверждённые факторинговые линии
        </Typography>
      </Box>
      {isLoading ? (
        <Box
          sx={{
            height: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" },
            overflow: "hidden",
            overflowY: "auto",
            gap: 2,
          }}
        >
          {isEmpty && <Alert severity="info">Список пуст</Alert>}

          {approvedLines.map((line) => (
            <FactoringLineRingProgress key={line.id} line={line} />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default FactoringProgressBarContainer;
