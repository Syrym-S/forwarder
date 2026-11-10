import { useTranslation } from "react-i18next";
import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import AddDriverForm from "../../features/drivers/add-drivers-form";
import DriverListContainer from "../../components/drivers/driver-list-container";
import SavedDataModal from "../../components/drivers/saved-data-modal";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FormInput from "../../shared/ui/input/form-input";
import { VIEWS } from "../../shared/const/leads";

const Drivers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [savedData, setSavedData] = useState(null);

  const isCardsView = view === VIEWS.cards;

  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(inputValue.trim());
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
          {t("ui.drivers")}
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {t("ui.driver_list")}
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
          buttonText={t("ui.invite_driver")}
          sx={{
            width: { xs: "100%", sm: "auto" },
            flex: { sm: 1 },
            minWidth: 0,
            mx: 0,
            gap: 2,
          }}
        />

        <FormInput
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label={t("ui.search_driver")}
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

      <DriverListContainer key={query} view={view} query={query} />

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
