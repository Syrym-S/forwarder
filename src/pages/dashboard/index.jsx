import React from "react";
import RootLayout from "../../components/layout/root-layout";
import Map from "../../components/dashboard/map";
import { Container, Switch } from "@mui/material";

const Dashboard = () => {
  return (
    <RootLayout withoutDataCheck>
      <Container
        sx={{
          padding: "30px",
        }}
      >
        <Map />
        <Switch />
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
