import React from "react";
import RootLayout from "../../components/layout/root-layout";
import Map from "../../components/dashboard/map";
import { Container } from "@mui/material";

const Dashboard = () => {
  return (
    <Container
      sx={{
        padding: "30px",
      }}
    >
      <Map />
    </Container>
  );
};

export default Dashboard;
