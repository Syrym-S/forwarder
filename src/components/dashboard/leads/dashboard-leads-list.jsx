import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Divider,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DashboardLeadItem from "./dashboard-lead-item";
import DashboardLeadItemSkeleton from "./dashboard-lead-item-skeleton";

const DASHBOARD_LEADS_PER_PAGE = 5;

const DashboardLeadsList = ({
  leads = [],
  isLoading = false,
  emptyMessage,
  selectedLeadId,
  hoveredLeadId,
  onSelectLead,
  onHoverLead,
  onLeaveLead,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const pageCount = Math.max(
    1,
    Math.ceil(leads.length / DASHBOARD_LEADS_PER_PAGE),
  );

  const paginatedLeads = useMemo(() => {
    const startIndex = (page - 1) * DASHBOARD_LEADS_PER_PAGE;
    const endIndex = startIndex + DASHBOARD_LEADS_PER_PAGE;

    return leads.slice(startIndex, endIndex);
  }, [leads, page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [leads]);

  return (
    <Paper
      variant="outlined"
      sx={{
        height: {
          xs: "auto",
          lg: 730,
        },
        borderRadius: 3,
        p: 2,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 16,
            color: "font_color.heading",
          }}
        >
          {t("dashboard.active_leads")}
        </Typography>

        <Typography
          sx={{
            fontWeight: 400,
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          {t("dashboard.select_lead_to_highlight_route")}
        </Typography>
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          maxHeight: { xs: 480, lg: "none" },
          overflowY: "auto",
          pr: 0.5,
        }}
      >
        {isLoading && (
          <Stack
            spacing={1.25}
            role="status"
            aria-label={t("ui.loading")}
            aria-busy="true"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <DashboardLeadItemSkeleton key={index} />
            ))}
          </Stack>
        )}

        {!isLoading && !leads.length && (
          <Alert severity="info">
            {emptyMessage || t("dashboard.no_active_leads_yet")}
          </Alert>
        )}

        {!isLoading && Boolean(leads.length) && (
          <Stack spacing={1.25}>
            {paginatedLeads.map((lead) => (
              <DashboardLeadItem
                key={lead.id}
                lead={lead}
                isSelected={String(selectedLeadId) === String(lead.id)}
                isHovered={String(hoveredLeadId) === String(lead.id)}
                onSelectLead={onSelectLead}
                onHoverLead={onHoverLead}
                onLeaveLead={onLeaveLead}
              />
            ))}
          </Stack>
        )}
      </Box>

      {leads.length > DASHBOARD_LEADS_PER_PAGE && (
        <Pagination
          color="primary"
          shape="rounded"
          size="small"
          page={page}
          count={pageCount}
          onChange={handlePageChange}
          sx={{
            mt: 1.5,
            mx: "auto",
          }}
        />
      )}
    </Paper>
  );
};

export default DashboardLeadsList;
