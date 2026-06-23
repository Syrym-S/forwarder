import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import DriverCard from "../../components/drivers/driver-card";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DriverDetailsModal from "../../components/drivers/driver-details-modal";

const Drivers = () => {
  const [_, setSearchParams] = useSearchParams();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const drivers = useDriverStore((state) => state.drivers);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const getDriverDetails = useDriverStore((state) => state.getDriverDetails);

  const handleClear = () => {
    setSelectedDriver(null);
    setSearchParams("");
  };

  useEffect(() => {
    getDrivers();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      setSearchParams({
        driver_id: selectedDriver?.id,
      });

      getDriverDetails(selectedDriver?.id);
    }
  }, [selectedDriver]);

  if (!drivers) return <Loader />;

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
          <DriverCard
            key={driver.id}
            driver={driver}
            setSelectedDriver={setSelectedDriver}
          />
        ))}

        {selectedDriver && (
          <DriverDetailsModal
            selectedDriver={selectedDriver}
            handleClear={handleClear}
          />
        )}
      </Box>
    </RootLayout>
  );
};

export default Drivers;
