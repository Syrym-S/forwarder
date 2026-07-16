import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import RootLayout from "../../components/layout/root-layout";
import LeadCard from "../../components/leads/lead-card";
import { Tabs, Tab, Button, Autocomplete, TextField } from "@mui/material";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { LeadCardSkeleton } from "../../shared/ui/lead-card-skeleton";
import LeadsTable from "../../components/leads/leads-table";
import { VIEWS } from "../../shared/const/leads";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import ViewTabs from "../../shared/ui/view-tabs";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { HISTORY_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import { Controller, useForm } from "react-hook-form";
import LeadListContainer from "../../components/leads/lead-list-container";

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
  const PAGE_COUNT = Math.ceil(count / perPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getHistoryLeads({
      page: page,
      filterStatus: filterStatus,
    });
  }, [page, filterStatus, getHistoryLeads]);

  useEffect(() => {
    clearCurrentLead();
  }, []);

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 3,
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
        }}
      >
        <ViewTabs view={view} setView={setView} withoutDataAdd />

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
              >
                <MenuItem value="">
                  <em>Все</em>
                </MenuItem>
                {HISTORY_LEAD_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
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
