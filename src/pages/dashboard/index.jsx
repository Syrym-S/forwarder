import React from "react";
import RootLayout from "../../components/layout/root-layout";
import Map from "../../components/dashboard/map";
import { Box, Container, Switch } from "@mui/material";

const Dashboard = () => {
  return (
    <RootLayout withoutDataCheck>
      <Container
        sx={{
          padding: {
            xs: "10px",
            sm: "30px",
          },
        }}
      >
        <Box
          sx={{
            boxShadow: 2,
            borderRadius: 2,
          }}
        >
          <Map />
        </Box>
        <Switch />
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
