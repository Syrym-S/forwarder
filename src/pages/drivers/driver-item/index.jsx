import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDriverStore } from "../../../app/store/drivers/driver-store";
import Loader from "../../../components/layout/loader";
import { Box } from "@mui/material";
import RootLayout from "../../../components/layout/root-layout";
import DriverHeading from "../../../components/drivers/driver-heading";

const DriverItem = () => {
  const { id } = useParams();

  const currentDriver = useDriverStore((state) => state.currentDriver);
  const getDriverDetails = useDriverStore((state) => state.getDriverDetails);

  console.log(currentDriver);

  useEffect(() => {
    getDriverDetails(id);
  }, []);

  if (!currentDriver) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <DriverHeading driver={currentDriver} />
    </RootLayout>
  );
};

export default DriverItem;
