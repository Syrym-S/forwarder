import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import DriverCard from "../../components/drivers/driver-card";
import { Box, Pagination, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import DriverDetailsModal from "../../components/drivers/driver-details-modal";
import Loader from "../../components/layout/loader";
import PageLoader from "../../shared/ui/loaders/page-loader";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import { VIEWS } from "../../shared/const/leads";
import ViewTabs from "../../shared/ui/view-tabs";
import DriversTable from "../../components/drivers/driver-table";
import AddDriverForm from "../../features/drivers/add-drivers-form";
import InviteLinkModal from "../../components/customers/invite-link-modal";

const Drivers = () => {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.table);
  //Позже венру если нужно будет , показывает по какому слово пошел запрос поиска
  const [__, setSearchRequest] = useState("");
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
  const inviteLink = useDriverStore((state) => state.inviteLink);
  const clearInviteLink = useDriverStore((state) => state.clearInviteLink);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isEmpty = drivers?.length === 0;
  const isCardsView = view === VIEWS.cards;

  const handleClear = () => {
    setSelectedDriver(null);
    setSearchParams("");
  };

  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
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

  if (isLoading)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          display: "flex",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          handleOpenForm={handleOpenForm}
          buttonText="Пригласить водителя"
        />
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
            width: "300px",
            borderRadius: "50px",
          }}
        />
      </Box>

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
        {isCardsView &&
          drivers.map((driver) => (
            <>
              <DriverCard
                key={driver.id}
                driver={driver}
                setSelectedDriver={setSelectedDriver}
              />
            </>
          ))}

        {open && <AddDriverForm open={open} onClose={handleCloseForm} />}

        {inviteLink && (
          <InviteLinkModal
            inviteLink={inviteLink}
            clearInviteLink={clearInviteLink}
          />
        )}

        {!isCardsView && <DriversTable drivers={drivers} />}

        {isEmpty && <>{isLoading ? <PageLoader /> : <EmptyListUI />}</>}

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
          color="primary"
          shape="rounded"
          page={page}
          count={PAGE_COUNT}
          onChange={handlePageChange}
        />
      </Box>
    </RootLayout>
  );
};

export default Drivers;
