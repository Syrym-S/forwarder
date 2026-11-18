import CustomSelect from "../../shared/ui/input/custom-select";
import FormInput from "../../shared/ui/input/form-input";
import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import PageHeading from "../../shared/ui/page-heading";
import RenderErrorContext from "../../shared/ui/errors/render-error-context";

import { useEffect, useState } from "react";
import { Alert, Box } from "@mui/material";
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
  const leadParams = useLeadsStore((state) => state.leadParams);

  const { t } = useTranslation();
  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  const deafultValues = useFormDefaultValues();

  const isCardsView = view === VIEWS.cards;
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
    <RootLayout withoutDataCheck>
      <PageHeading
        title={t(
          showDrafts ? "active_leads.drafts_title" : "active_leads.title",
        )}
        description={t("active_leads.description")}
      />

      {showDrafts && (
        <Alert severity="warning" sx={{ my: 1 }}>
          {t("active_leads.drafts_description")}
        </Alert>
      )}

      {error && <RenderErrorContext error={error} />}

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
            ...STATUS_OPTIONS.map((option) => ({
              ...option,
              label: t(option.label),
            })),
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
          label={t(
            showDrafts
              ? "active_leads.search_drafts"
              : "active_leads.search_leads",
          )}
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
