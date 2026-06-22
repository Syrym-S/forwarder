import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import DriverCard from "../../components/drivers/driver-card";
import { Box } from "@mui/material";

const Drivers = () => {
  const drivers = useDriverStore((state) => state.drivers);
  const getDrivers = useDriverStore((state) => state.getDrivers);

  useEffect(() => {
    getDrivers();
  }, []);

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 3,
          width: "60%",
          mx: "auto",
        }}
      >
        {drivers.map((driver) => (
          <DriverCard driver={driver} />
        ))}
      </Box>
    </RootLayout>
  );
};

export default Drivers;
