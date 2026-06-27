import React from "react";
import { VIEWS } from "../const/leads";
import { Box, Button, Tab, Tabs } from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";

const ViewTabs = ({
  view,
  setView,
  handleOpenForm,
  withoutDataAdd = false,
}) => {
  const isCradsView = view === VIEWS.cards;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mx: "auto",
        width: {
          xs: "100%",
          sm: isCradsView ? "60%" : "100%",
        },
      }}
    >
      <Tabs
        value={view}
        onChange={(_, newValue) => {
          setView(newValue);
        }}
      >
        <Tab label={<ViewListRoundedIcon />} value={VIEWS.table} />
        <Tab label={<GridViewRoundedIcon />} value={VIEWS.cards} />
      </Tabs>

      {!withoutDataAdd && (
        <Button variant="outlined" onClick={handleOpenForm}>
          Добавить
        </Button>
      )}
    </Box>
  );
};

export default ViewTabs;
