import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import RootLayout from "../../components/layout/root-layout";
import LeadCard from "../../components/leads/lead-card";
import { Tabs, Tab, Button } from "@mui/material";
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

const ActiveLeads = () => {
  const [openForm, setOpenForm] = useState(false);
  const [view, setView] = useState(VIEWS.cards);

  const leads = useLeadsStore((state) => state.leads);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  const isLeadsEmpty = leads.length === 0;

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );
  const deafultValues = useFormDefaultValues();

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    clearCurrentLead();
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.lead) {
      fetchLeads();
    }
  }, [newNotification]);

  return (
    <RootLayout withoutDataCheck>
      <ViewTabs
        isLeadsEmpty={isLeadsEmpty}
        view={view}
        setView={setView}
        handleOpenForm={handleOpenForm}
      />

      <LeadListContainer isLeadsEmpty={isLeadsEmpty} view={view} />

      <AddLeadForm
        openForm={openForm}
        setOpenForm={setOpenForm}
        initialValues={deafultValues}
      />
    </RootLayout>
  );
};

export default ActiveLeads;
