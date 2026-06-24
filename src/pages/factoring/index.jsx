import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import FactoringCard from "../../components/factoring/factoring-card";
import Loader from "../../components/layout/loader";
import FactoringTable from "../../components/factoring/factoring-table";
import { VIEWS } from "../../shared/const/leads";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

const Factoring = () => {
  const factorings = useFactoringStore((state) => state.factorings);
  const getFactorings = useFactoringStore((state) => state.getFactorings);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [view, setView] = useState(VIEWS.table);

  const handleModalOpen = () => {
    setOpenFormModal(true);
  };

  const handleModalClose = () => {
    setOpenFormModal(false);
  };

  useEffect(() => {
    getFactorings();
  }, []);

  console.log(factorings);

  if (!factorings) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={view}
          onChange={(_, newValue) => {
            setView(newValue);
          }}
        >
          <Tab label={<ViewListRoundedIcon />} value={VIEWS.table} />
          <Tab label={<GridViewRoundedIcon />} value={VIEWS.cards} />
        </Tabs>
        <Button variant="outlined" onClick={handleModalOpen}>
          Создать
        </Button>
      </Box>

      {view === VIEWS.cards && (
        <Box
          sx={{
            width: "60%",
            mx: "auto",
            display: "grid",
            gap: 2,
            gridTemplateColumns: "1fr",
          }}
        >
          {factorings.map((factoring) => (
            <FactoringCard factoring={factoring} key={factoring.index} />
          ))}
        </Box>
      )}

      {view === VIEWS.table && <FactoringTable factorings={factorings} />}
      <CreateFactoringForm
        openFormModal={openFormModal}
        handleModalClose={handleModalClose}
      />
    </RootLayout>
  );
};

export default Factoring;
