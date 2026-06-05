import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import axios from "axios";
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
import { useLeadsStore } from "../../app/store/leads-store";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { LeadCardSkeleton } from "../../shared/ui/lead-card-skeleton";
import LeadsTable from "../../components/leads/leads-table";
import { VIEWS } from "../../shared/const/leads";
import AddLeadForm from "../../features/leads/add-lead-form";

const ActiveLeads = () => {
  const [openForm, setOpenForm] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  const leads = useLeadsStore((state) => state.leads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);

  const handleChange = (event) => {
    setView(event.target.value);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
    <RootLayout data={leads} isLoading={isLoading}>
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
        <Button variant="outlined">Добавить</Button>
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
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </Box>
      )}
      {view === VIEWS.table && <LeadsTable leads={leads} />}
      <AddLeadForm openForm={openForm} setOpenForm={setOpenForm} />
    </RootLayout>
  );
};

export default ActiveLeads;
