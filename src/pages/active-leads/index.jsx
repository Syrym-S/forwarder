import CustomSelect from "../../shared/ui/input/custom-select";
import FormInput from "../../shared/ui/input/form-input";
import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { ACTIVE_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";
import { useTranslation } from "react-i18next";

const STATUS_LABEL_KEYS = {
  new: "dashboard.new",
  add_driver: "dashboard.driver_added",
  start_driver: "dashboard.trip_started",
  start_loading: "dashboard.loading_operation",
  verification_loading: "dashboard.loading_confirmed",
  start_unloading: "dashboard.unloading_operation",
  verification_unloading: "dashboard.unloading_confirmed",
  emergency_situation: "dashboard.emergency",
};
const DRAFT_OPTION = { value: "draft", label: "active_leads.draft" };
const STATUS_OPTIONS = [
  ...ACTIVE_LEAD_STATUS_OPTIONS.map((option) => ({
    ...option,
    label: STATUS_LABEL_KEYS[option.value],
  })),
  DRAFT_OPTION,
];

const ActiveLeads = () => {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState(null);
  const showDrafts = filterStatus?.value === DRAFT_OPTION.value;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openForm, setOpenForm] = useState(false);
  const [view, setView] = useState(VIEWS.table);

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

  const isCardsView = view === VIEWS.cards;

  const isLeadsEmpty = leads?.length === 0;

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );
  const deafultValues = useFormDefaultValues();

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
      fetchLeads(useLeadsStore.getState().leadsParams);
    }
  }, [newNotification, notification_type, fetchLeads]);

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
    <RootLayout withoutDataCheck>
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            сolor: "font_color.heading",
          }}
        >
          {t(showDrafts ? "active_leads.drafts_title" : "active_leads.title")}
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          {t("active_leads.description")}
        </Typography>
      </Box>
      {showDrafts && (
        <Alert severity="warning" sx={{ my: 1 }}>
          {t("active_leads.drafts_description")}
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mx: "auto",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
        }}
      >
        <ViewTabs
          isLeadsEmpty={isLeadsEmpty}
          view={view}
          withoutKanban
          setView={setView}
          handleOpenForm={handleOpenForm}
        />

        <CustomSelect
          id="active-lead-status"
          label={t("active_leads.status")}
          options={[
            { value: "", label: t("active_leads.all_statuses") },
            ...STATUS_OPTIONS.map((option) => ({ ...option, label: t(option.label) })),
          ]}
          value={filterStatus?.value ?? ""}
          onChange={(event) => {
            const value = event.target.value;

            const selected =
              STATUS_OPTIONS.find((option) => option.value === value) ?? null;

            setFilterStatus(selected);
            setPage(1);
          }}
          sx={{ width: { xs: "100%", md: "35%" } }}
          slotProps={{
            select: {
              MenuProps: { slotProps: { paper: { sx: { maxHeight: 430 } } } },
            },
          }}
        />

        <FormInput
          label={t(showDrafts ? "active_leads.search_drafts" : "active_leads.search_leads")}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          size="small"
          fullWidth
          sx={{
            width: { xs: "100%", sm: 300 },
            maxWidth: { sm: 300 },
            minWidth: 0,
            flexShrink: 1,
            ml: { sm: "auto" },
            my: 1,
          }}
        />
      </Box>

      <LeadListContainer
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
