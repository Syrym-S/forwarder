import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Alert, Box, Container, Typography, useMediaQuery } from "@mui/material";

import RootLayout from "../../components/layout/root-layout";
import DashboardMapPanel from "../../components/dashboard/dashboard-map-panel";
import DashboardLeadsList from "../../components/dashboard/leads/dashboard-leads-list";

import { useLeadsStore } from "../../app/store/leads/leads-store";
import TendersMainContainer from "../../components/dashboard/tenders/tenders-main-container";
import FactoringProgressBarContainer from "../../components/dashboard/factoring-line/factoring-progress-bar-container";
import FactoringTable from "../../components/factoring/factoring-table";
import TableSkeleton from "../../shared/ui/table-skeleton";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import DashboardStats from "../../components/dashboard/statistics-cards/stats-cards-container";
import { useStatsStore } from "../../app/store/stats/use-stats-store";
import { DEFAULT_LEAD_MAP_STATUSES } from "../../shared/const/lead-map-statuses";

const Dashboard = () => {
  const { t } = useTranslation();
  const mapPanelRef = useRef(null);
  const isMobile = useMediaQuery(
    (theme) => `${theme.breakpoints.down("sm")}, (max-height: 500px) and (pointer: coarse)`,
  );
  const stats = useStatsStore((state) => state.stats);
  const leads = useLeadsStore((state) => state.leads);
  const factorings = useFactoringStore((state) => state.factorings);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const isFactoringsLoading = useFactoringStore((state) => state.isLoading);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const error = useLeadsStore((state) => state.error);

  const awaitingApproveFactorings = factorings?.filter(
    (factoring) =>
      factoring.status === "await_paid" ||
      factoring.status === "verified_participant",
  );

  const [selectedStatuses, setSelectedStatuses] = useState(() => [
    ...DEFAULT_LEAD_MAP_STATUSES,
  ]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [hoveredLeadId, setHoveredLeadId] = useState(null);
  const visibleSelectedLeadId = leads.some(
    (lead) => String(lead.id) === String(selectedLeadId),
  )
    ? selectedLeadId
    : null;
  const visibleHoveredLeadId = leads.some(
    (lead) => String(lead.id) === String(hoveredLeadId),
  )
    ? hoveredLeadId
    : null;
  const highlightedLeadId = visibleHoveredLeadId || visibleSelectedLeadId;

  const showFactoringTable = window.APP_DATA.features.factoring;
  const showTenders = window.APP_DATA?.features?.tender !== false;

  const handleStatusChange = (event) => {
    const { value, checked } = event.target;
    setSelectedStatuses((statuses) =>
      checked
        ? [...statuses, value]
        : statuses.filter((status) => status !== value),
    );
    setSelectedLeadId(null);
    setHoveredLeadId(null);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
    setHoveredLeadId(null);
  };

  const handleHoverLead = (leadId) => {
    setHoveredLeadId(leadId);
  };

  const handleLeaveLead = () => {
    setHoveredLeadId(null);
  };

  useEffect(() => {
    fetchLeads({ page: 1, status: selectedStatuses }, { allPages: true });
  }, [fetchLeads, selectedStatuses]);

  useEffect(() => {
    if (showFactoringTable) {
      getFactorings();
    }
  }, [getFactorings, showFactoringTable]);

  return (
    <RootLayout
      withoutDataCheck
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 1.5, sm: "30px" },
        pl: { sm: "22vw" },
      }}
    >
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

        {error && <Alert severity="error">{error}</Alert>}

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
          <Box ref={mapPanelRef} sx={{ minWidth: 0, scrollMarginTop: "72px" }}>
            <DashboardMapPanel
              leads={leads}
              isLoading={isLoading}
              selectedLeadId={visibleSelectedLeadId}
              highlightedLeadId={highlightedLeadId}
              onSelectLead={handleSelectLead}
              selectedStatuses={selectedStatuses}
              onStatusChange={handleStatusChange}
              onResetStatuses={() => {
                setSelectedStatuses([...DEFAULT_LEAD_MAP_STATUSES]);
                setSelectedLeadId(null);
                setHoveredLeadId(null);
              }}
            />
          </Box>

          <DashboardLeadsList
            leads={leads}
            isLoading={isLoading}
            emptyMessage={t("active_leads.table.noResultsOverlayLabel")}
            selectedLeadId={visibleSelectedLeadId}
            hoveredLeadId={visibleHoveredLeadId}
            onSelectLead={(leadId) => {
              handleSelectLead(leadId);
              if (isMobile) {
                mapPanelRef.current?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth",
                  block: "start",
                });
              }
            }}
            onHoverLead={handleHoverLead}
            onLeaveLead={handleLeaveLead}
          />
        </Box>

        {showTenders && <TendersMainContainer />}

        {showFactoringTable && <FactoringProgressBarContainer />}

        {showFactoringTable && (
          <Box
            sx={{
              minWidth: 0,
              p: 2,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              "& > .MuiPaper-root": { boxShadow: "none", my: 0, height: 420 },
              "& .MuiDataGrid-root": { border: 0, fontSize: 13 },
              "& .MuiDataGrid-columnHeader": { bgcolor: "background.default" },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: "font_color.heading",
                mb: 0.5,
              }}
            >
              {t("dashboard.pending_factoring")}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 2 }}>
              {t("dashboard.pending_requests_description")}
            </Typography>
            {isFactoringsLoading ? (
              <TableSkeleton />
            ) : (
              <FactoringTable factorings={awaitingApproveFactorings} />
            )}
          </Box>
        )}
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
