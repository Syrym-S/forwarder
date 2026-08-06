import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Pagination,
  Tooltip,
  Typography,
} from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import Loader from "../../components/layout/loader";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";
import ApplicationsTenderCard from "../../components/tenders/applications-tender-card";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import ViewTabs from "../../shared/ui/view-tabs";
import ApplicationsTenderTable from "../../components/tenders/applications-tender-table";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { useNavigate } from "react-router-dom";

const TenderApplications = () => {
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const customerTenders = useTendersStore((state) => state.customerTenders);
  const clearCurrentTender = useTendersStore(
    (state) => state.clearCurrentTender,
  );
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const isLoading = useTendersStore((state) => state.isLoading);

  const customerCount = useTendersStore((state) => state.customerCount);
  const customerPerPage = useTendersStore((state) => state.customerPerPage);

  const PAGE_COUNT = Math.ceil(customerCount / customerPerPage);
  const isCardsView = view === VIEWS.cards;

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getCustomerTenders({
      page: page,
    });
  }, [page]);

  useEffect(() => {
    clearCurrentTender();
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.tender) {
      getCustomerTenders();
    }
  }, [newNotification]);

  const isTenderEmpty = customerTenders.length === 0;

  const handleNavigateToTenderHistory = () => {
    navigate("/tenders-history");
  };

  if (isLoading)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ViewTabs view={view} setView={setView} withoutDataAdd />
        <Tooltip title="История участия в тендерах">
          <IconButton onClick={handleNavigateToTenderHistory}>
            <HistoryOutlined />
          </IconButton>
        </Tooltip>
      </Box>

      {isTenderEmpty && <Alert severity="info">Доступных тендеров нет</Alert>}

      {isCardsView && !isTenderEmpty && (
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "60%",
            },
            mx: "auto",
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
            },
          }}
        >
          {customerTenders.map((tender) => (
            <ApplicationsTenderCard key={tender.id} tender={tender} />
          ))}
        </Box>
      )}

      {!isCardsView && !isTenderEmpty && (
        <ApplicationsTenderTable tenders={customerTenders} />
      )}

      {!isTenderEmpty && (
        <Pagination
          page={page}
          count={PAGE_COUNT}
          color="primary"
          shape="rounded"
          sx={{
            mx: "auto",
            width: "fit-content",
          }}
          onChange={handlePageChange}
        />
      )}
    </RootLayout>
  );
};

export default TenderApplications;
