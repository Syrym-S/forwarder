import { Box, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import DriversTable from "./driver-table";
import DriverCard from "./driver-card";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { VIEWS } from "../../shared/const/leads";
import { useSearchParams } from "react-router-dom";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import PageLoader from "../../shared/ui/loaders/page-loader";
import DriverDetailsModal from "./driver-details-modal";
import RootLayout from "../layout/root-layout";

const DriverListContainer = ({ view }) => {
  const [_, setSearchParams] = useSearchParams();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [page, setPage] = useState(1);

  const count = useDriverStore((state) => state.count);
  const perPage = useDriverStore((state) => state.perPage);
  const getDriverDetails = useDriverStore((state) => state.getDriverDetails);
  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const clearDriverDetails = useDriverStore(
    (state) => state.clearDriverDetails,
  );

  const isCardsView = view === VIEWS.cards;
  const isEmpty = drivers?.length === 0;
  const PAGE_COUNT = Math.ceil(count / perPage);

  const handleClear = () => {
    setSelectedDriver(null);
    setSearchParams("");
    clearDriverDetails();
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (selectedDriver) {
      setSearchParams({
        driver_id: selectedDriver?.id,
      });

      getDriverDetails(selectedDriver?.id);
    }
  }, [selectedDriver]);

  if (isLoading) return <PageLoader />;

  return (
    <Box>
      {isEmpty && <>{isLoading ? <PageLoader /> : <EmptyListUI />}</>}

      {!isCardsView && (
        <DriversTable drivers={drivers} setSelectedDriver={setSelectedDriver} />
      )}

      {isCardsView && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: isCardsView ? "60%" : "100%",
            },
            mx: "auto",
            display: "grid",
            gap: 5,
          }}
        >
          {drivers.map((driver) => (
            <>
              <DriverCard
                key={driver.id}
                driver={driver}
                setSelectedDriver={setSelectedDriver}
              />
            </>
          ))}
        </Box>
      )}

      {selectedDriver && (
        <DriverDetailsModal
          selectedDriver={selectedDriver}
          handleClear={handleClear}
        />
      )}

      <Pagination
        sx={{
          mx: "auto",
          width: "fit-content",
        }}
        color="primary"
        shape="rounded"
        page={page}
        count={PAGE_COUNT}
        onChange={handlePageChange}
      />
    </Box>
  );
};

export default DriverListContainer;
