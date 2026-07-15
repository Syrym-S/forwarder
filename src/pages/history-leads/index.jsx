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
import { LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import { Controller, useForm } from "react-hook-form";

const HistoryLeads = () => {
  const { control } = useForm();

  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.table);

  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.history_count);
  const perPage = useLeadsStore((state) => state.history_perPage);
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const isCardsView = view === VIEWS.cards;

  const PAGE_COUNT = Math.ceil(count / perPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getHistoryLeads({
      page: page,
    });
  }, [page]);

  useEffect(() => {
    clearCurrentLead();
  }, []);

  if (isLoading)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout data={historyLeads} isLoading={isLoading}>
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
          defaultValue="new"
          render={({ field }) => (
            <Autocomplete
              options={LEAD_STATUS_OPTIONS}
              value={
                LEAD_STATUS_OPTIONS.find(
                  (option) => option.value === field.value,
                ) ?? null
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: 300,
                },
              }}
              onChange={(_, newValue) => {
                field.onChange(newValue?.value ?? "");
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              renderInput={(params) => (
                <TextField {...params} label="Статус" size="small" fullWidth />
              )}
            />
          )}
        />
      </Box>

      {isCardsView && (
        <Box
          sx={{
            display: "grid",
            gap: 5,
            my: "10px",
            mx: "auto",
            width: {
              xs: "100%",
              sm: "60%",
            },
            gridTemplateColumns: "1fr",
          }}
        >
          {historyLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </Box>
      )}

      {!isCardsView && <LeadsTable leads={historyLeads} />}

      <Pagination
        page={page}
        count={PAGE_COUNT}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        sx={{
          width: "fit-content",
          mx: "auto",
        }}
      />
    </RootLayout>
  );
};

export default HistoryLeads;
