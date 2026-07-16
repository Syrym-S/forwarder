import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import RootLayout from "../../components/layout/root-layout";
import LeadCard from "../../components/leads/lead-card";
import { Tabs, Tab, Button, Autocomplete, TextField } from "@mui/material";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { LeadCardSkeleton } from "../../shared/ui/lead-card-skeleton";
import LeadsTable from "../../components/leads/leads-table";
import { VIEWS } from "../../shared/const/leads";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import Loader from "../../components/layout/loader";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import ViewTabs from "../../shared/ui/view-tabs";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import LeadListContainer from "../../components/leads/lead-list-container";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { Controller } from "react-hook-form";
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
  const filterActiveLeadsByStatus = useLeadsStore(
    (state) => state.filterActiveLeadsByStatus,
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
    setFilterStatus(null);
  };

  useEffect(() => {
    clearCurrentLead();
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.lead) {
      fetchLeads();
    }
  }, [newNotification]);

  useEffect(() => {
    if (filterStatus) {
      filterActiveLeadsByStatus({
        status: filterStatus.value,
      });
    }
  }, [filterStatus, filterActiveLeadsByStatus]);

  useEffect(() => {
    fetchLeads({
      page: page,
    });
  }, [page]);

  return (
    <RootLayout withoutDataCheck>
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
            width: {
              xs: "100%",
              sm: 300,
            },
          }}
        >
          <InputLabel>Статус</InputLabel>

          <Select
            label="Статус"
            value={filterStatus?.label}
            onChange={(event) => {
              const value = event.target.value;

              setFilterStatus(value);

              const selected =
                ACTIVE_LEAD_STATUS_OPTIONS.find(
                  (option) => option.value === value,
                ) ?? null;

              setFilterStatus(selected);

              if (!value) {
                fetchLeads();
              }
            }}
          >
            <MenuItem value="">Все</MenuItem>

            {ACTIVE_LEAD_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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

      <AddLeadForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        initialValues={deafultValues}
      />
    </RootLayout>
  );
};

export default ActiveLeads;
