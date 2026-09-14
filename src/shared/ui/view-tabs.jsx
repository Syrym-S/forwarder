import { VIEWS } from "../const/leads";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";

const ViewTabs = ({
  view,
  setView,
  handleOpenForm,
  withoutKanban = false,
  withoutDataAdd = false,
  isLeadsEmpty,
  buttonText = "Добавить",
}) => {
  const isCardsView = view === VIEWS.cards;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mx: "auto",
        width: {
          xs: "100%",
          sm: isCardsView ? "60%" : "100%",
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
          aria-label="Переключение отображения экспедиторов"
          sx={{
            alignSelf: {
              xs: "stretch",
              sm: "auto",
            },

            "& .MuiToggleButton-root": {
              px: 1.5,
              minWidth: 40,

              "&.Mui-selected": {
                color: "rgb(24, 87, 196)",
                backgroundColor: "rgba(112, 160, 243, 0.17)",
              },
            },
          }}
        >
          <ToggleButton value={VIEWS.table}>
            <ViewListRoundedIcon fontSize="small" />
          </ToggleButton>

          <ToggleButton value={VIEWS.cards}>
            <GridViewRoundedIcon fontSize="small" />
          </ToggleButton>

          {!withoutKanban && (
            <ToggleButton value={VIEWS.kanban}>
              <ViewKanbanOutlinedIcon fontSize="small" />
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      )}

      {!withoutDataAdd && (
        <Button
          variant="contained"
          onClick={handleOpenForm}
          sx={{
            backgroundColor: "rgb(24, 87, 196)",
            color: "white",
            borderRadius: 2,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default ViewTabs;
