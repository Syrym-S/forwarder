import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import AddDriverForm from "../../features/drivers/add-drivers-form";
import DriverListContainer from "../../components/drivers/driver-list-container";
import SavedDataModal from "../../components/drivers/saved-data-modal";
import { useEffect, useState } from "react";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { Box, Typography } from "@mui/material";
import FormInput from "../../shared/ui/input/form-input";
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
          my: 1,
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <ViewTabs
          view={view}
          withoutKanban
          setView={setView}
          handleOpenForm={handleOpenForm}
          buttonText="Пригласить водителя"
          sx={{ width: { xs: "100%", sm: "auto" }, flex: { sm: 1 }, minWidth: 0, mx: 0, gap: 2 }}
        />

        <FormInput
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label="Поиск водителя"
          fullWidth
          size="small"
          sx={{
            width: { xs: "100%", sm: 300 },
            maxWidth: { sm: 300 },
            minWidth: 0,
            flexShrink: 1,
            ml: { sm: "auto" },
            my: 1,
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
