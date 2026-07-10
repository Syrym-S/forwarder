import React from "react";
import { useState, useEffect } from "react";
import { Box, Container, Switch } from "@mui/material";

import RootLayout from "../../components/layout/root-layout";
import Map from "../../components/dashboard/map";
import DashboardLeadsList from "../../components/dashboard/leads/dashboard-leads-list";

import { useLeadsStore } from "../../app/store/leads/leads-store";

const Dashboard = () => {
  const leads = useLeadsStore((state) => state.acceptedLeads);
  const fetchAcceptedLeads = useLeadsStore((state) => state.fetchAcceptedLeads);
  const isLoading = useLeadsStore((state) => state.isAcceptedLeadsLoading);

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
  }, [fetchAcceptedLeads]);

  return (
    <RootLayout withoutDataCheck>
      <Container
        maxWidth={false}
        sx={{
          px: {
            xs: "10px",
            sm: "30px",
          },
          py: {
            xs: "10px",
            sm: "30px",
          },
        }}
      >
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
              boxShadow: 2,
              borderRadius: 2,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
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
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
