import { useTranslation } from "react-i18next";
import CustomSelect from "../../shared/ui/input/custom-select";
import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import LeadsExportButton from "../../components/leads/leads-export-button";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { HISTORY_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../../shared/ui/input/form-input";

const dateInputStyles = (hasValue) => ({
  width: hasValue ? 164 : 56,
  flexShrink: 0,
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
    padding: hasValue ? "0 38px 0 12px" : 0,
    color: hasValue ? "text.primary" : "transparent",
    cursor: "pointer",
  },
  "& input::-webkit-datetime-edit": {
    display: hasValue ? "block" : "none",
  },
  "& input::-webkit-calendar-picker-indicator": {
    position: "absolute",
    inset: hasValue ? "0 12px 0 auto" : 0,
    width: hasValue ? 18 : "100%",
    height: hasValue ? 18 : "100%",
    padding: 0,
    margin: hasValue ? "auto 0" : 0,
    backgroundPosition: "center",
    backgroundSize: "18px 18px",
    cursor: "pointer",
    opacity: 0.7,
  },
  "&:hover input::-webkit-calendar-picker-indicator, & .Mui-focused input::-webkit-calendar-picker-indicator":
    {
      opacity: 1,
    },
});

const HistoryLeads = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

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
    <RootLayout withoutDataCheck>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            сolor: "font_color.heading",
          }}
        >
          {t("ui.lead_history")}
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {t("ui.completed_deleted_lead_list")}
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

        <LeadsExportButton />

        <Controller
          name="status"
          control={control}
          defaultValue=""
          render={({ field: { ref, ...field } }) => (
            <CustomSelect
              {...field}
              inputRef={ref}
              label={t("ui.status")}
              options={[
                { value: "", label: t("ui.all_statuses") },
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
                setPage(1);
              }}
              sx={{ width: { xs: "100%", sm: 300 } }}
              slotProps={{
                select: {
                  MenuProps: {
                    slotProps: { paper: { sx: { maxHeight: 430 } } },
                  },
                },
              }}
            />
          )}
        />

        <FormInput
          size="small"
          label={t("dashboard.from")}
          type="date"
          value={dateFrom}
          onChange={(event) => {
            setDateFrom(event.target.value);
            setPage(1);
          }}
          sx={dateInputStyles(Boolean(dateFrom))}
        />

        <FormInput
          size="small"
          label={t("dashboard.to")}
          type="date"
          value={dateTo}
          onChange={(event) => {
            setDateTo(event.target.value);
            setPage(1);
          }}
          sx={dateInputStyles(Boolean(dateTo))}
        />

        <FormInput
          size="small"
          label={t("active_leads.table.columnsManagementSearchTitle")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          sx={{
            width: 500,
          }}
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
