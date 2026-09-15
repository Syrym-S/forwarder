import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import ViewTabs from "../../shared/ui/view-tabs";
import LeadListContainer from "../../components/leads/lead-list-container";
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
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
          Активные лиды
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список заявок на перевозку
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
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
          setView={setView}
          handleOpenForm={handleOpenForm}
        />

        <FormControl
          size="small"
          sx={{
            minWidth: 250,
          }}
        >
          <InputLabel id="status-select-label">Статус</InputLabel>

          <Select
            labelId="status-select-label"
            label="Статус"
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
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  maxHeight: 430,
                },
              },
            }}
            sx={{
              borderRadius: "10px",

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D5BE3",
                borderWidth: 2,
              },

              "& .MuiSelect-select": {
                py: 1.2,
                px: 2,
                fontSize: "1rem",
                color: "#172B4D",
              },

              "& .MuiSvgIcon-root": {
                color: "#6B7280",
              },
            }}
          >
            <MenuItem value="">Все статусы</MenuItem>

            {ACTIVE_LEAD_STATUS_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  py: 1.2,
                  fontSize: "1rem",
                  color: "#172B4D",

                  "&.Mui-selected": {
                    backgroundColor: "#EAF1FB",
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: "#EAF1FB",
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
