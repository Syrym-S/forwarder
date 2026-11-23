import CustomSelect from "../../shared/ui/input/custom-select";
import FormInput from "../../shared/ui/input/form-input";
import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import RenderErrorContext from "../../shared/ui/errors/render-error-context";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AddRounded from "@mui/icons-material/AddRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import { DRAFT_OPTION, STATUS_OPTIONS, VIEWS } from "../../shared/const/leads";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { useTranslation } from "react-i18next";

const ActiveLeads = () => {
  const [filterStatus, setFilterStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const isCompactScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const view = selectedView ?? (isCompactScreen ? VIEWS.cards : VIEWS.table);

  const leads = useLeadsStore((state) => state.leads);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const count = useLeadsStore((state) => state.count);
  const perPage = useLeadsStore((state) => state.perPage);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const error = useLeadsStore((state) => state.error);
  const leadParams = useLeadsStore((state) => state.leadParams);

  const { t, i18n } = useTranslation();
  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  const deafultValues = useFormDefaultValues();

  const showDrafts = filterStatus?.value === DRAFT_OPTION.value;
  const isLeadsEmpty = leads?.length === 0;

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    clearCurrentLead();
  }, [clearCurrentLead]);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.lead) {
      fetchLeads(leadParams);
    }
  }, [newNotification, notification_type, fetchLeads, leadParams]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        fetchLeads({
          page,
          ...(showDrafts ? { is_draft: 1 } : { status: filterStatus?.value }),
          ...(search.trim() ? { q: search.trim() } : {}),
        });
      },
      search.trim() ? 300 : 0,
    );

    return () => clearTimeout(timer);
  }, [page, filterStatus, showDrafts, search, fetchLeads]);

  return (
    <RootLayout
      withoutDataCheck
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 1.5, sm: 3 },
        pl: { sm: "calc(20vw + 24px)" },
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 700, color: "font_color.heading" }}>
            {t(showDrafts ? "active_leads.drafts_title" : "active_leads.title")}
          </Typography>
          <Chip
            size="small"
            label={isLoading ? "—" : `${Number(count).toLocaleString(i18n.resolvedLanguage)} ${t("dashboard.lead_count", { count: Number(count) })}`}
            sx={{ bgcolor: "background.main", color: "primary.main", fontSize: 11, fontWeight: 600, maxWidth: "100%" }}
          />
        </Box>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {t("active_leads.description")}
        </Typography>
      </Box>

      {showDrafts && (
        <Alert severity="warning" sx={{ my: 1 }}>
          {t("active_leads.drafts_description")}
        </Alert>
      )}

      {error && <RenderErrorContext error={error} />}

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: 3,
          minWidth: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
          <ViewTabs
            view={view}
            withoutKanban
            withoutDataAdd
            setView={setSelectedView}
            sx={{
              width: "auto",
              mx: 0,
              "& .MuiToggleButton-root": { minWidth: 44, minHeight: 44 },
            }}
          />
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AddRounded />}
            onClick={handleOpenForm}
            sx={{ minHeight: 36, borderRadius: 2, textTransform: "none", px: 1.5, fontSize: 13, fontWeight: 500 }}
          >
            {t("common.add")}
          </Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, .75fr)" }, gap: 2 }}>
          <FormInput
            id="active-leads-search"
            label={t(showDrafts ? "active_leads.search_drafts" : "active_leads.search_leads")}
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ fontSize: 20, color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              minWidth: 0,
              "& .MuiOutlinedInput-root": { minHeight: 44, borderRadius: 2.5 },
              "& .MuiInputBase-input": { fontSize: { xs: 16, sm: 14 } },
            }}
          />

          <CustomSelect
            id="active-lead-status"
            label={t("active_leads.status")}
            options={[
              { value: "", label: t("active_leads.all_statuses") },
              ...STATUS_OPTIONS.map((option) => ({
                ...option,
                label: t(option.label),
              })),
            ]}
            value={filterStatus?.value ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              const selected = STATUS_OPTIONS.find(
                (option) => option.value === value,
              ) ?? null;

              setFilterStatus(selected);
              setPage(1);
            }}
            fullWidth
            sx={{ minWidth: 0, "& .MuiOutlinedInput-root": { minHeight: 44 } }}
            slotProps={{
              inputLabel: { shrink: true },
              select: {
                displayEmpty: true,
                MenuProps: {
                  slotProps: {
                    paper: {
                      sx: {
                        maxHeight: "min(430px, 70dvh)",
                        "& .MuiMenuItem-root": { minHeight: 44 },
                      },
                    },
                  },
                },
              },
            }}
          />
        </Box>
      </Paper>

      <LeadListContainer
        responsive
        compactCards
        leads={leads}
        view={view}
        isLeadsEmpty={isLeadsEmpty}
        filterStatus={filterStatus}
        page={page}
        count={count}
        perPage={perPage}
        isLoading={isLoading}
        handlePageChange={handlePageChange}
      />

      {openForm && (
        <AddLeadForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          initialValues={deafultValues}
          onSaved={({ isDraft }) => {
            setPage(1);
            setFilterStatus(isDraft ? DRAFT_OPTION : null);
            setSearch("");
          }}
        />
      )}
    </RootLayout>
  );
};

export default ActiveLeads;
