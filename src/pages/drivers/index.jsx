import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import DriverCard from "../../components/drivers/driver-card";
import { Box, Pagination, Stack, TextField, Typography } from "@mui/material";
import DriverDetailsModal from "../../components/drivers/driver-details-modal";
import Loader from "../../components/layout/loader";
import PageLoader from "../../shared/ui/loaders/page-loader";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import { VIEWS } from "../../shared/const/leads";
import ViewTabs from "../../shared/ui/view-tabs";
import DriversTable from "../../components/drivers/driver-table";
import AddDriverForm from "../../features/drivers/add-drivers-form";
import InviteLinkModal from "../../components/customers/invite-link-modal";
import DriverListContainer from "../../components/drivers/driver-list-container";

const Drivers = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  //Позже венру если нужно будет , показывает по какому слово пошел запрос поиска
  const [__, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");

  const getDrivers = useDriverStore((state) => state.getDrivers);
  const searchDriver = useDriverStore((state) => state.searchDriver);
  const inviteLink = useDriverStore((state) => state.inviteLink);
  const clearInviteLink = useDriverStore((state) => state.clearInviteLink);

  const isCardsView = view === VIEWS.cards;

  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  useEffect(() => {
    getDrivers();
  }, []);

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
          flexDirection: {
            xs: "column",
            sm: "row",
          },
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
            width: {
              xs: "100%",
              sm: "300px",
            },
            borderRadius: "50px",
            zIndex: 0,
          }}
        />
      </Box>

      <DriverListContainer view={view} />

      {open && <AddDriverForm open={open} onClose={handleCloseForm} />}

      {inviteLink && (
        <InviteLinkModal
          inviteLink={inviteLink}
          clearInviteLink={clearInviteLink}
        />
      )}
    </RootLayout>
  );
};

export default Drivers;
