import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import DriverCard from "../../components/drivers/driver-card";
import { Box, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DriverDetailsModal from "../../components/drivers/driver-details-modal";
import Loader from "../../components/layout/loader";

const Drivers = () => {
  const [page, setPage] = useState(1);
  const [searchRequest, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [_, setSearchParams] = useSearchParams();
  const [selectedDriver, setSelectedDriver] = useState(null);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const getDriverDetails = useDriverStore((state) => state.getDriverDetails);
  const count = useDriverStore((state) => state.count);
  const perPage = useDriverStore((state) => state.perPage);
  const searchDriver = useDriverStore((state) => state.searchDriver);

  const PAGE_COUNT = Math.ceil(count / perPage);

  const handleClear = () => {
    setSelectedDriver(null);
    setSearchParams("");
  };

  const handlePageChange = (_, value) => {
    setPage(value);
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

  useEffect(() => {
    const value = inputValue?.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getDrivers();
        setSearchRequest("");

        return;
      }

      searchDriver({ q: value });
      setSearchRequest(value);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  if (!drivers) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Stack sx={{ width: "60%", mx: "auto" }}>
        <TextField
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label="Поиск водителя"
          fullWidth
          size="small"
          sx={{
            display: "block",
            my: 1,
          }}
        />

        {searchRequest && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: "600",
              }}
            >
              Результат по поиску:
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: "300",
                fontStyle: "italic",
              }}
            >
              {searchRequest}
            </Typography>

            <Typography
              sx={{
                px: 1,
                fontWeight: "400",
                fontStyle: "italic",
              }}
            >
              (Для поиска по БИН или ИИН ввидите 12 цифр)
            </Typography>
          </Box>
        )}
      </Stack>
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
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <DriverCard
                key={driver.id}
                driver={driver}
                setSelectedDriver={setSelectedDriver}
              />
            )}
          </>
        ))}

        {selectedDriver && (
          <DriverDetailsModal
            selectedDriver={selectedDriver}
            handleClear={handleClear}
          />
        )}

        <Pagination
          sx={{
            mx: "auto",
          }}
          page={page}
          count={PAGE_COUNT}
          onChange={handlePageChange}
        />
      </Box>
    </RootLayout>
  );
};

export default Drivers;
