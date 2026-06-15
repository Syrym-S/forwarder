import { useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Button } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";

const TenderApplications = () => {
  const [openForm, setOpenForm] = useState(false);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <RootLayout withoutDataCheck>
      <Button onClick={handleOpenForm} variant="outlined">
        Создать тендер
      </Button>

      {openForm && (
        <TenderForm openForm={openForm} handleCloseForm={handleCloseForm} />
      )}
    </RootLayout>
  );
};

export default TenderApplications;
