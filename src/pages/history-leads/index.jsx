import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { HISTORY_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import { Controller, useForm } from "react-hook-form";

const HistoryLeads = () => {
  const [filterStatus, setFilterStatus] = useState(null);

  const { control } = useForm();

  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.table);

  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.history_count);
  const perPage = useLeadsStore((state) => state.history_perPage);
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);

  const isLeadsEmpty = historyLeads?.length === 0;
  const isCardsView = view === VIEWS.cards;

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getHistoryLeads({
      page: page,
      status: filterStatus,
    });
  }, [page, filterStatus, getHistoryLeads]);

  useEffect(() => {
    clearCurrentLead();
  }, []);

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
          История лидов
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список завершенных или удаленных лидов
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1,
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
        }}
      >
        <ViewTabs view={view} setView={setView} withoutDataAdd withoutKanban />

        <Controller
          name="status"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FormControl
              size="small"
              sx={{
                width: {
                  xs: "100%",
                  sm: 300,
                },
                zIndex: 0,
              }}
            >
              <InputLabel>Статус</InputLabel>

              <Select
                {...field}
                label="Статус"
                value={field.value ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  field.onChange(value);

                  const selected =
                    HISTORY_LEAD_STATUS_OPTIONS.find(
                      (option) => option.value === value,
                    ) ?? null;

                  setFilterStatus(selected);

                  if (!value) {
                    getHistoryLeads();
                  }
                }}
                sx={{
                  borderRadius: "10px",
                }}
              >
                <MenuItem
                  value=""
                  sx={{
                    py: 0.9,
                    fontSize: "0.9rem",
                    color: "#172B4D",
                    fontWeight: 500,
                    textTransform: "none",
                  }}
                >
                  Все статусы
                </MenuItem>
                {HISTORY_LEAD_STATUS_OPTIONS.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{
                      py: 1.2,
                      fontSize: "0.9rem",
                      color: "#172B4D",
                      fontWeight: 500,
                      textTransform: "none",
                      gap: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",

                      "&.Mui-selected": {
                        backgroundColor: "#EAF1FB",
                      },

                      "&.Mui-selected:hover": {
                        backgroundColor: "#EAF1FB",
                      },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </Box>

      <LeadListContainer
        leads={historyLeads}
        view={view}
        isLeadsEmpty={isLeadsEmpty}
        filterStatus={filterStatus}
        page={page}
        count={count}
        perPage={perPage}
        isLoading={isLoading}
        handlePageChange={handlePageChange}
      />
    </RootLayout>
  );
};

export default HistoryLeads;
