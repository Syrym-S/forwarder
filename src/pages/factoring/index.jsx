import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import { Box, Button } from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import FactoringCard from "../../components/factoring/factoring-card";
import Loader from "../../components/layout/loader";
import FactoringTable from "../../components/factoring/factoring-table";

const Factoring = () => {
  const factorings = useFactoringStore((state) => state.factorings);
  const getFactorings = useFactoringStore((state) => state.getFactorings);

  const [openFormModal, setOpenFormModal] = useState(false);

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
      <Button variant="outlined" onClick={handleModalOpen}>
        Создать
      </Button>
      <Box>
        {/* {factorings.map((factoring) => (
          <FactoringCard factoring={factoring} key={factoring.index} />
        ))} */}

        <FactoringTable factorings={factorings} />
      </Box>
      <CreateFactoringForm
        openFormModal={openFormModal}
        handleModalClose={handleModalClose}
      />
    </RootLayout>
  );
};

export default Factoring;
