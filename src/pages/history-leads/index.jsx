import CustomSelect from "../../shared/ui/input/custom-select";
import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
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
          История перевозок
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список завершенных или удаленных перевозок
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
          render={({ field: { ref, ...field } }) => (
            <CustomSelect
              {...field}
              inputRef={ref}
              label="Статус"
              options={[
                { value: "", label: "Все статусы" },
                ...HISTORY_LEAD_STATUS_OPTIONS,
              ]}
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
              sx={{ width: { xs: "100%", sm: 300 } }}
              slotProps={{
                select: {
                  MenuProps: { slotProps: { paper: { sx: { maxHeight: 430 } } } },
                },
              }}
            />
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
