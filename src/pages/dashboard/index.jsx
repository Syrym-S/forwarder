import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";

import RootLayout from "../../components/layout/root-layout";
import Map from "../../components/dashboard/map";
import DashboardLeadsList from "../../components/dashboard/leads/dashboard-leads-list";

import { useLeadsStore } from "../../app/store/leads/leads-store";
import TendersMainContainer from "../../components/dashboard/tenders/tenders-main-container";
import FactoringProgressBarContainer from "../../components/dashboard/factoring-line/factoring-progress-bar-container";
import FactoringTable from "../../components/factoring/factoring-table";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import DashboardStats from "../../components/dashboard/statistics-cards/stats-cards-container";
import { useStatsStore } from "../../app/store/stats/use-stats-store";

const Dashboard = () => {
  const stats = useStatsStore((state) => state.stats);
  const leads = useLeadsStore((state) => state.acceptedLeads);
  const factorings = useFactoringStore((state) => state.factorings);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const fetchAcceptedLeads = useLeadsStore((state) => state.fetchAcceptedLeads);
  const isLoading = useLeadsStore((state) => state.isAcceptedLeadsLoading);

  const awaitingApproveFactorings = factorings?.filter(
    (factoring) =>
      factoring.status === "await_paid" ||
      factoring.status === "verified_participant",
  );

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [hoveredLeadId, setHoveredLeadId] = useState(null);
  const highlightedLeadId = hoveredLeadId || selectedLeadId;

  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
  };

  const handleHoverLead = (leadId) => {
    setHoveredLeadId(leadId);
  };

  const handleLeaveLead = () => {
    setHoveredLeadId(null);
  };

  useEffect(() => {
    fetchAcceptedLeads();
    getFactorings();
  }, [fetchAcceptedLeads, getFactorings]);

  return (
    <RootLayout withoutDataCheck>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 0, sm: 0 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          minWidth: 0,
        }}
      >
        <DashboardStats data={stats} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.5fr) minmax(380px, 1fr)",
            },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              borderRadius: 3,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
              <Typography component="h2" sx={{ fontSize: 16, fontWeight: 600, color: "font_color.heading" }}>Карта перевозок</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>Маршруты активных перевозок</Typography>
            </Box>
            <Map
              leads={leads}
              selectedLeadId={selectedLeadId}
              highlightedLeadId={highlightedLeadId}
              onSelectLead={handleSelectLead}
            />
          </Box>

          <DashboardLeadsList
            leads={leads}
            isLoading={isLoading}
            selectedLeadId={selectedLeadId}
            hoveredLeadId={hoveredLeadId}
            onSelectLead={handleSelectLead}
            onHoverLead={handleHoverLead}
            onLeaveLead={handleLeaveLead}
          />
        </Box>

        <TendersMainContainer />

        <FactoringProgressBarContainer />

        <Box sx={{ minWidth: 0, p: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 3, "& > .MuiPaper-root": { boxShadow: "none", my: 0, height: 420 }, "& .MuiDataGrid-root": { border: 0, fontSize: 13 }, "& .MuiDataGrid-columnHeader": { bgcolor: "background.default" } }}>
          <Typography component="h2" sx={{ fontSize: 16, fontWeight: 600, color: "font_color.heading", mb: 0.5 }}>Факторинг в ожидании</Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>Заявки на подтверждении и в ожидании оплаты</Typography>
          <FactoringTable factorings={awaitingApproveFactorings} />
        </Box>
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
