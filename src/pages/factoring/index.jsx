import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import { Box, Button } from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import FactoringCard from "../../components/factoring/factoring-card";
import Loader from "../../components/layout/loader";

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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 3,
          width: "60%",
          mx: "auto",
        }}
      >
        {factorings.map((factoring) => (
          <FactoringCard factoring={factoring} key={factoring.index} />
        ))}
      </Box>
      <CreateFactoringForm
        openFormModal={openFormModal}
        handleModalClose={handleModalClose}
      />
    </RootLayout>
  );
};

export default Factoring;
