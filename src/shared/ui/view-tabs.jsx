import React from "react";
import { VIEWS } from "../const/leads";
import {
  Box,
  Button,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";

const tabs = [
  {
    value: VIEWS.table,
    icon: <ViewListRoundedIcon fontSize="small" />,
  },
  {
    value: VIEWS.cards,
    icon: <GridViewRoundedIcon fontSize="small" />,
  },
  {
    value: VIEWS.kanban,
    icon: <ViewKanbanOutlinedIcon fontSize="small" />,
  },
];

const ViewTabs = ({
  view,
  setView,
  handleOpenForm,
  withoutDataAdd = false,
  isLeadsEmpty,
  buttonText = "Добавить",
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
      {!isLeadsEmpty && (
        <ToggleButtonGroup
          exclusive
          value={view}
          onChange={(_, newValue) => {
            if (newValue !== null) {
              setView(newValue);
            }
          }}
          size="small"
          color="primary"
          aria-label="Переключение отображения экспедиторов"
          sx={{
            alignSelf: {
              xs: "stretch",
              sm: "auto",
            },
            "& .MuiToggleButton-root": {
              px: 1.5,
              minWidth: 40,
            },
          }}
        >
          {tabs.map((tab) => (
            <ToggleButton key={tab.value} value={tab.value}>
              {tab.icon}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      )}

      {!withoutDataAdd && (
        <Button variant="outlined" onClick={handleOpenForm}>
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default ViewTabs;
