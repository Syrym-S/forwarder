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
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { LeadCardSkeleton } from "../../shared/ui/lead-card-skeleton";
import LeadsTable from "../../components/leads/leads-table";
import { VIEWS } from "../../shared/const/leads";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const HistoryLeads = () => {
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.table);

  const historyLeads = useLeadsStore((state) => state.historyLeads);
  const count = useLeadsStore((state) => state.count);
  const perPage = 1;
  const getHistoryLeads = useLeadsStore((state) => state.getHistoryLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={view}
          onChange={(_, newValue) => {
            setView(newValue);
          }}
        >
          <Tab label={<ViewListRoundedIcon />} value={VIEWS.table} />
          <Tab label={<GridViewRoundedIcon />} value={VIEWS.cards} />
        </Tabs>
      </Box>
      {view === VIEWS.cards && (
        <Box
          sx={{
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
          }}
        >
          {historyLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </Box>
      )}
      {view === VIEWS.table && <LeadsTable leads={historyLeads} />}
      <Pagination page={page} count={PAGE_COUNT} onChange={handlePageChange} />
    </RootLayout>
  );
};

export default HistoryLeads;
