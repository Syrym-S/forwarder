import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import FactorLineForm from "../../features/factor-line/factor-line-form";
import ViewTabs from "../../shared/ui/view-tabs";
import FactorLineTable from "../../components/factor-line/factor-line-table";
import FactorLineContainer from "../../components/factor-line/factor-line-container";
import { STATUS } from "../../shared/const/tenders";
import { VIEWS } from "../../shared/const/leads";
import { useFactorStore } from "../../app/store/factor/factor-store";

const Factor = () => {
  const getFactoringsLine = useFactorStore((state) => state.getFactoringsLine);

  const [view, setView] = useState(VIEWS.table);
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    getFactoringsLine();
  }, []);

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          p: 1,
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          handleOpenForm={handleOpenForm}
        />

        {openForm && (
          <FactorLineForm open={openForm} setOpenForm={setOpenForm} />
        )}
      </Box>

      <FactorLineContainer view={view} />
    </RootLayout>
  );
};

export default Factor;
