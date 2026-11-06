import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from "@mui/material";

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
import {
  DEFAULT_LEAD_MAP_STATUSES,
  LEAD_MAP_STATUS_OPTIONS,
} from "../../shared/const/lead-map-statuses";

const Dashboard = () => {
  const { t } = useTranslation();
  const stats = useStatsStore((state) => state.stats);
  const leads = useLeadsStore((state) => state.leads);
  const factorings = useFactoringStore((state) => state.factorings);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
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
  }, [getFactorings]);

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
            <Box
              sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "font_color.heading",
                }}
              >
                {t("dashboard.lead_map")}
              </Typography>
              <Typography
                sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}
              >
                {t("dashboard.active_lead_routes")}
              </Typography>
              <FormControl
                component="fieldset"
                sx={{ m: 0, mt: 1.5, p: 0, minWidth: 0, border: 0 }}
              >
                <FormLabel
                  component="legend"
                  sx={{ fontSize: 13, fontWeight: 600 }}
                >
                  {t("dashboard.status")}
                </FormLabel>
                <FormGroup row sx={{ columnGap: 1.5, rowGap: 0.5 }}>
                  {LEAD_MAP_STATUS_OPTIONS.map(({ value, label, color }) => (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox
                          size="small"
                          value={value}
                          checked={selectedStatuses.includes(value)}
                          onChange={handleStatusChange}
                          sx={{ color, "&.Mui-checked": { color } }}
                        />
                      }
                      label={t(label)}
                      sx={{ "& .MuiFormControlLabel-label": { fontSize: 13 } }}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
            <Map
              leads={leads}
              isLoading={isLoading}
              selectedLeadId={visibleSelectedLeadId}
              highlightedLeadId={highlightedLeadId}
              onSelectLead={handleSelectLead}
            />
          </Box>

          <DashboardLeadsList
            leads={leads}
            isLoading={isLoading}
            emptyMessage={t("active_leads.table.noResultsOverlayLabel")}
            selectedLeadId={visibleSelectedLeadId}
            hoveredLeadId={visibleHoveredLeadId}
            onSelectLead={handleSelectLead}
            onHoverLead={handleHoverLead}
            onLeaveLead={handleLeaveLead}
          />
        </Box>

        <TendersMainContainer />

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
            <FactoringTable factorings={awaitingApproveFactorings} />
          </Box>
        )}
      </Container>
    </RootLayout>
  );
};

export default Dashboard;
