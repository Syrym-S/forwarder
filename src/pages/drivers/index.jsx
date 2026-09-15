import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import AddDriverForm from "../../features/drivers/add-drivers-form";
import DriverListContainer from "../../components/drivers/driver-list-container";
import SavedDataModal from "../../components/drivers/saved-data-modal";
import { useEffect, useState } from "react";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { Box, TextField, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";

const Drivers = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  //Позже венру если нужно будет , показывает по какому слово пошел запрос поиска
  const [__, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [savedData, setSavedData] = useState(null);

  const getDrivers = useDriverStore((state) => state.getDrivers);
  const searchDriver = useDriverStore((state) => state.searchDriver);
  // const inviteLink = useDriverStore((state) => state.inviteLink);
  // const clearInviteLink = useDriverStore((state) => state.clearInviteLink);

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
        setSearchRequest("");
        getDrivers();

        return;
      }

      searchDriver({ q: value });
      setSearchRequest(value);
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <RootLayout withoutDataCheck>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            сolor: "font_color.heading",
          }}
        >
          Водители
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список водителей
        </Typography>
      </Box>

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
          withoutKanban
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

      {open && (
        <AddDriverForm
          open={open}
          onClose={handleCloseForm}
          setSavedData={setSavedData}
        />
      )}

      {savedData && (
        <SavedDataModal savedData={savedData} setSavedData={setSavedData} />
      )}
    </RootLayout>
  );
};

export default Drivers;
