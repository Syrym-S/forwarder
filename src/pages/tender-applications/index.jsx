import FormInput from "../../shared/ui/input/form-input";
import PrimaryButton from "../../shared/ui/button/primary-button";
import RootLayout from "../../components/layout/root-layout";
import ApplicationsTenderCard from "../../components/tenders/applications-tender-card";
import ViewTabs from "../../shared/ui/view-tabs";
import ApplicationsTenderTable from "../../components/tenders/applications-tender-table";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import DataContainer from "../../shared/ui/data-container";
import { useEffect, useState } from "react";
import { Alert, Box, Pagination, Typography } from "@mui/material";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { useNavigate } from "react-router-dom";

const TenderApplications = () => {
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);


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



  const handlePageChange = (_, value) => {
    setPage(value);
  };



  useEffect(() => {
    clearCurrentTender();
  }, [clearCurrentTender]);

  useEffect(() => {
    return useNotificationsStore.subscribe((state, previous) => {
      if (state.newNotification === previous.newNotification) return;
      const { notification_type } = parserNotificationType(
        state.newNotification?.type || "",
      );
      if (notification_type === NOTIFICATION_TYPE.tender) {
        setRefresh((value) => value + 1);
      }
    });
  }, []);

  const isTenderEmpty = customerTenders.length === 0;

  const handleNavigateToTenderHistory = () => {
    navigate("/tenders-history");
  };

  useEffect(() => {
    const value = inputValue.trim();
    if (value && value.length < 2) return;

    const timer = setTimeout(() => {
      getCustomerTenders({ page, ...(value ? { q: value } : {}) });
    }, value ? 1000 : 0);

    return () => clearTimeout(timer);
  }, [page, inputValue, getCustomerTenders, refresh]);

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
          Аукционные заявки
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Список аукционов созданные заказчиками для экспедиторов
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 1,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
          justifyContent: "space-between",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          withoutKanban
          withoutDataAdd
          sx={{ width: { xs: "100%", sm: "auto" }, flex: { sm: 1 }, minWidth: 0, mx: 0, gap: 2 }}
        />

        <PrimaryButton
          text="История участия"
          aria-label="История участия в аукционах"
          variant="outlined"
          size="medium"
          startIcon={<HistoryOutlined />}
          onClick={handleNavigateToTenderHistory}
          sx={{
            minHeight: 40,
            px: 2,
            fontWeight: 500,
            flexShrink: 0,
            width: { xs: "100%", sm: "auto" },
          }}
        />

        <FormInput
          onChange={(e) => {
            setInputValue(e.target.value);
            setPage(1);
          }}
          label="Поиск аукциона"
          fullWidth
          size="small"
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

      <DataContainer isLoading={isLoading}>
        {isTenderEmpty && (
          <Alert
            severity="info"
            sx={{
              mx: "auto",
              width: {
                xs: "100%",
                sm: isCardsView ? "60%" : "100%",
              },
            }}
          >
            Доступных аукционов нет
          </Alert>
        )}

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
              my: 5,
              width: "fit-content",
            }}
            onChange={handlePageChange}
          />
        )}
      </DataContainer>
    </RootLayout>
  );
};

export default TenderApplications;
