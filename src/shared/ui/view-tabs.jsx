import { VIEWS } from "../const/leads";
import { Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewKanbanOutlinedIcon from "@mui/icons-material/ViewKanbanOutlined";
import PrimaryButton from "./button/primary-button";
import ActionTooltip from "./action-tooltip";
import { useTranslation } from "react-i18next";

const ViewTabs = ({
  view,
  setView,
  handleOpenForm,
  withoutKanban = false,
  withoutDataAdd = false,
  isLeadsEmpty,
  buttonText,
  sx = {},
}) => {
  const { t } = useTranslation();
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
        ...sx,
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
          aria-label={t("common.change_view")}
          sx={{
            alignSelf: {
              xs: "stretch",
              sm: "auto",
            },

            "& .MuiToggleButton-root": {
              px: 1.5,
              minWidth: 40,

              "&.Mui-selected": {
                color: "primary.main",
                backgroundColor: "rgba(112, 160, 243, 0.17)",
              },
            },
          }}
        >
          <ActionTooltip title={t("common.table_view")}>
            <ToggleButton value={VIEWS.table} aria-label={t("common.table_view")}>
              <ViewListRoundedIcon fontSize="small" />
            </ToggleButton>
          </ActionTooltip>

          <ActionTooltip title={t("common.cards_view")}>
            <ToggleButton value={VIEWS.cards} aria-label={t("common.cards_view")}>
              <GridViewRoundedIcon fontSize="small" />
            </ToggleButton>
          </ActionTooltip>

          {!withoutKanban && (
            <ActionTooltip title={t("common.kanban_view")}>
              <ToggleButton value={VIEWS.kanban} aria-label={t("common.kanban_view")}>
                <ViewKanbanOutlinedIcon fontSize="small" />
              </ToggleButton>
            </ActionTooltip>
          )}
        </ToggleButtonGroup>
      )}

      {/* {!withoutDataAdd && (
        <Button
          variant="contained"
          onClick={handleOpenForm}
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 2,
          }}
        >
          {buttonText}
        </Button>
      )} */}

      {!withoutDataAdd && (
        <PrimaryButton text={buttonText ?? t("common.add")} onClick={handleOpenForm} />
      )}
    </Box>
  );
};

export default ViewTabs;
