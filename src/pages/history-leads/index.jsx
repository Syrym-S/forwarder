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
import PageLoader from "../../shared/ui/loaders/page-loader";

const HistoryLeads = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.cards);

  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.history_count);
  const perPage = useLeadsStore((state) => state.history_perPage);
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
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
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
