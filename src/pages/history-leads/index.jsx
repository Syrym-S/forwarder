import { useTranslation } from "react-i18next";
import CustomSelect from "../../shared/ui/input/custom-select";
import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import LeadsExportButton from "../../components/leads/leads-export-button";
import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { HISTORY_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import FormInput from "../../shared/ui/input/form-input";

const filterInputStyles = {
  width: "100%",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    height: 42,
    borderRadius: 2.5,
    backgroundColor: "background.paper",
    transition: "background-color 0.2s, box-shadow 0.2s",
    "& fieldset": { borderColor: "#DFE1E6" },
    "&:hover": {
      backgroundColor: "#FAFBFC",
      "& fieldset": { borderColor: "#B3BAC5" },
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.08)",
      "& fieldset": { borderColor: "primary.main" },
    },
  },
  "& .MuiInputBase-input": {
    boxSizing: "border-box",
    height: "100%",
    minWidth: 0,
    padding: "10px 12px",
    fontSize: 14,
  },
};

const HistoryLeads = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [view, setSelectedView] = useState(VIEWS.table);

  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.history_count);
  const perPage = useLeadsStore((state) => state.history_perPage);
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);

  const isLeadsEmpty = historyLeads?.length === 0;

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    const value = search.trim();
    const timer = setTimeout(() => {
      getHistoryLeads({
        page,
        per_page: 10,
        ...(filterStatus ? { status: filterStatus.value } : {}),
        ...(value ? { [/^\d+$/.test(value) ? "num" : "q"]: value } : {}),
        ...(dateFrom ? { date_from: dateFrom } : {}),
        ...(dateTo ? { date_to: dateTo } : {}),
      });
    }, value ? 300 : 0);

    return () => clearTimeout(timer);
  }, [page, filterStatus, search, dateFrom, dateTo, getHistoryLeads]);

  useEffect(() => {
    clearCurrentLead();
  }, [clearCurrentLead]);

  return (
    <RootLayout
      withoutDataCheck
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 2, sm: 3 },
        pl: { sm: "calc(20vw + 24px)" },
      }}
    >
      <Box sx={{ mb: 3, minWidth: 0 }}>
        <Typography
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: { xs: 22, sm: 24 },
            color: "font_color.heading",
          }}
        >
          {t("ui.lead_history")}
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {t("ui.completed_deleted_lead_list")}
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 3,
          minWidth: 0,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            flexWrap: "wrap",
            mb: 2.5,
          }}
        >
          <ViewTabs
            view={view}
            setView={setSelectedView}
            withoutDataAdd
            withoutKanban
            sx={{ width: "auto", mx: 0 }}
          />
          <LeadsExportButton />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "minmax(0, 1.2fr) repeat(2, minmax(0, 1fr)) minmax(0, 1.4fr)",
            },
            gap: 2,
          }}
        >
          <CustomSelect
            id="history-leads-status"
            label={t("ui.status")}
            options={[
              { value: "", label: t("ui.all_statuses") },
              ...HISTORY_LEAD_STATUS_OPTIONS,
            ]}
            value={filterStatus?.value ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              const selected = HISTORY_LEAD_STATUS_OPTIONS.find(
                (option) => option.value === value,
              ) ?? null;

              setFilterStatus(selected);
              setPage(1);
            }}
            sx={{ width: "100%", minWidth: 0 }}
            slotProps={{
              select: {
                MenuProps: {
                  slotProps: { paper: { sx: { maxHeight: 430 } } },
                },
              },
            }}
          />

          <FormInput
            size="small"
            id="history-leads-date-from"
            label={t("ui.date_from")}
            type="date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              setPage(1);
            }}
            sx={filterInputStyles}
          />

          <FormInput
            size="small"
            id="history-leads-date-to"
            label={t("ui.date_to")}
            type="date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              setPage(1);
            }}
            sx={filterInputStyles}
          />

          <FormInput
            size="small"
            id="history-leads-search"
            label={t("active_leads.search_leads")}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            sx={filterInputStyles}
          />
        </Box>
      </Paper>

      <LeadListContainer
        responsive
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
