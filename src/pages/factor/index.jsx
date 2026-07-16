import React from "react";
import RootLayout from "../../components/layout/root-layout";
import { Alert, AlertTitle, Typography } from "@mui/material";

const Factor = () => {
  return (
    <RootLayout withoutDataCheck>
      <Alert
        severity="info"
        sx={{
          height: "fit-content",
        }}
      >
        <AlertTitle>Пусто!</AlertTitle>
        <Typography color="text.secondary">
          Данные временно отсутствуют
        </Typography>
      </Alert>
    </RootLayout>
  );
};

export default Factor;
