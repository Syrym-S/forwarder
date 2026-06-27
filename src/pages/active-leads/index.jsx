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
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import Loader from "../../components/layout/loader";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import ViewTabs from "../../shared/ui/view-tabs";

const ActiveLeads = () => {
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);
  const [view, setView] = useState(VIEWS.cards);

  const leads = useLeadsStore((state) => state.leads);
  const count = useLeadsStore((state) => state.count);
  const perPage = useLeadsStore((state) => state.perPage);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCardsView = view === VIEWS.cards;

  const deafultValues = useFormDefaultValues();

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    fetchLeads({
      page: page,
    });
  }, [page]);

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <ViewTabs view={view} setView={setView} handleOpenForm={handleOpenForm} />

      {isCardsView && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "60%",
            },
            mx: "auto",
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
            },
          }}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </Box>
      )}
      {!isCardsView && <LeadsTable leads={leads} />}
      <Pagination page={page} count={PAGE_COUNT} onChange={handlePageChange} />
      <AddLeadForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        initialValues={deafultValues}
      />
    </RootLayout>
  );
};

export default ActiveLeads;
