import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import RootLayout from "../../components/layout/root-layout";
import LeadCard from "../../components/leads/lead-card";
import { Tabs, Tab, Button } from "@mui/material";
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

const HistoryLeads = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.table);

  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.count);
  const perPage = 1;
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const isCradsView = view === VIEWS.cards;

  const PAGE_COUNT = Math.ceil(count / perPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getHistoryLeads({
      page: page,
    });
  }, [page]);

  if (isLoading)
    return (
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <CircularProgress aria-label="Loading…" />
      </Box>
    );

  return (
    <RootLayout data={historyLeads} isLoading={isLoading}>
      <ViewTabs view={view} setView={setView} withoutDataAdd />

      {isCradsView && (
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

      {!isCradsView && <LeadsTable leads={historyLeads} />}

      <Pagination page={page} count={PAGE_COUNT} onChange={handlePageChange} />
    </RootLayout>
  );
};

export default HistoryLeads;
