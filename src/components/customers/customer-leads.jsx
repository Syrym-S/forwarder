import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Chip,
  Link,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import dayjs from "dayjs";
import LeadStatus from "../../shared/ui/lead-status";
import CustomerCargoTooltip from "./customer-cargo-tooltip";

const LEADS_PER_PAGE = 3;

function formatDate(value) {
  const date = value?.date ?? value;
  return date && dayjs(date).isValid() ? dayjs(date).format("DD.MM.YYYY") : "—";
}

const CustomerLeadCard = ({ lead }) => {
  const { t } = useTranslation();
  const schedules = Array.isArray(lead.point_schedules)
    ? lead.point_schedules
    : [];
  const from =
    lead.from_location?.address ||
    lead.from ||
    lead.from_city ||
    t("ui.not_specified");
  const to =
    lead.to_location?.address ||
    lead.to ||
    lead.to_city ||
    t("ui.not_specified");
  const dates = [
    [t("dashboard.created"), lead.created_at],
    [
      t("ui.start_date"),
      lead.start_at ?? lead.started_at ?? schedules[0]?.start_at,
    ],
    [
      t("ui.end_date"),
      lead.end_at ?? lead.finished_at ?? schedules.at(-1)?.end_at,
    ],
  ];
  const route = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        minWidth: 0,
      }}
    >
      <Typography
        component="span"
        sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
      >
        {from}
      </Typography>
      <ArrowForwardRoundedIcon
        sx={{ fontSize: 18, flexShrink: 0, color: "text.secondary" }}
      />
      <Typography
        component="span"
        sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
      >
        {to}
      </Typography>
    </Box>
  );

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 3, textAlign: "center" }}
    >
      {lead.id ? (
        <Link
          component={RouterLink}
          to={`/leads/${lead.id}`}
          underline="hover"
          color="text.primary"
        >
          {route}
        </Link>
      ) : (
        route
      )}
      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 1,
          my: 1.5,
        }}
      >
        {dates.map(([label, value]) => (
          <Box key={label}>
            <Typography component="dt" variant="caption" color="text.secondary">
              {label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0 }}>
              {formatDate(value)}
            </Typography>
          </Box>
        ))}
      </Box>
      <CustomerCargoTooltip lead={lead} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t("ui.status")}:
        </Typography>
        <LeadStatus lead={lead} />
      </Box>
    </Paper>
  );
};

const CustomerLeads = ({ leads }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const pageCount = Math.ceil(leads.length / LEADS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visibleLeads = leads.slice(
    (currentPage - 1) * LEADS_PER_PAGE,
    currentPage * LEADS_PER_PAGE,
  );

  return (
    <Box
      component="section"
      aria-labelledby="customer-leads-title"
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        p: { xs: 2, sm: 3 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          pr: { md: 5 },
        }}
      >
        <Typography
          id="customer-leads-title"
          component="h3"
          sx={{ fontSize: 18, fontWeight: 600 }}
        >
          {t("dashboard.leads")}
        </Typography>
        <Chip label={leads.length} size="small" variant="outlined" />
      </Box>
      <Box
        ref={listRef}
        sx={{
          flex: { xs: "none", md: 1 },
          minHeight: 0,
          overflowY: { md: "auto" },
        }}
      >
        {leads.length ? (
          <Box sx={{ display: "grid", gap: 2 }}>
            {visibleLeads.map((lead, index) => (
              <CustomerLeadCard key={lead.id ?? index} lead={lead} />
            ))}
          </Box>
        ) : (
          <Alert severity="info">{t("active_leads.empty_list")}</Alert>
        )}
      </Box>
      {pageCount > 0 && (
        <Pagination
          aria-label={t("dashboard.leads")}
          page={currentPage}
          count={pageCount}
          color="primary"
          shape="rounded"
          siblingCount={0}
          sx={{ alignSelf: "center", pt: 3, flexShrink: 0 }}
          onChange={(_, value) => {
            setPage(value);
            listRef.current?.scrollTo({ top: 0 });
          }}
        />
      )}
    </Box>
  );
};

export default CustomerLeads;
