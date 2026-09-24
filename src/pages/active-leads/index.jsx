import CustomSelect from "../../shared/ui/input/custom-select";
import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { VIEWS } from "../../shared/const/leads";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { ACTIVE_LEAD_STATUS_OPTIONS } from "../../shared/const/tenders";

const ActiveLeads = () => {
  const [filterStatus, setFilterStatus] = useState(null);
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
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.lead) {
      fetchLeads();
    }
  }, [newNotification, notification_type, fetchLeads]);

  useEffect(() => {
    fetchLeads({
      page: page,
      status: filterStatus,
    });
  }, [page, filterStatus, fetchLeads]);

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
          Активные перевозки
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список заявок на перевозку
        </Typography>
      </Box>
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
          label="Статус"
          options={[
            { value: "", label: "Все статусы" },
            ...ACTIVE_LEAD_STATUS_OPTIONS,
          ]}
          value={filterStatus?.value ?? ""}
          onChange={(event) => {
            const value = event.target.value;

            const selected =
              ACTIVE_LEAD_STATUS_OPTIONS.find(
                (option) => option.value === value,
              ) ?? null;

            setFilterStatus(selected);

            if (!value) {
              fetchLeads();
            }
          }}
          sx={{ width: { xs: "100%", md: "35%" } }}
          slotProps={{
            select: {
              MenuProps: { slotProps: { paper: { sx: { maxHeight: 430 } } } },
            },
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
        />
      )}
    </RootLayout>
  );
};

export default ActiveLeads;
