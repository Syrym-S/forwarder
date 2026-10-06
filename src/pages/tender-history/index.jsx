import PrimaryButton from "../../shared/ui/button/primary-button";
import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import FormInput from "../../shared/ui/input/form-input";
import { Alert, Box, Pagination, Typography } from "@mui/material";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import ApplicationsTenderCard from "../../components/tenders/applications-tender-card";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import ViewTabs from "../../shared/ui/view-tabs";
import ApplicationsTenderTable from "../../components/tenders/applications-tender-table";
import { useNavigate } from "react-router-dom";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import DataContainer from "../../shared/ui/data-container";

const TenderHistory = () => {
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);


  const tendersHistory = useTendersStore((state) => state.tendersHistory);
  const clearCurrentTender = useTendersStore(
    (state) => state.clearCurrentTender,
  );
  const getTendersHistory = useTendersStore((state) => state.getTendersHistory);
  const isLoading = useTendersStore((state) => state.isLoading);
  const historyCount = useTendersStore((state) => state.historyCount);
  const historyPerPage = useTendersStore((state) => state.historyPerPage);

  const PAGE_COUNT = Math.ceil(historyCount / historyPerPage);
  const isCardsView = view === VIEWS.cards;



  const handleNavigateToTenders = () => {
    navigate("/tender-applications");
  };

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

  const isTenderEmplty = tendersHistory.length === 0;

  useEffect(() => {
    const value = inputValue.trim();
    if (value && value.length < 2) return;

    const timer = setTimeout(() => {
      getTendersHistory({ page, ...(value ? { q: value } : {}) });
    }, value ? 1000 : 0);

    return () => clearTimeout(timer);
  }, [page, inputValue, getTendersHistory, refresh]);

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
          История аукционов
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          История участия в аукционах созданных заказчиками
        </Typography>
      </Box>

      <Box
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "center",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
          justifyContent: "space-between",
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          withoutDataAdd
          withoutKanban
          sx={{
            width: { xs: "100%", sm: "auto" },
            flex: { sm: 1 },
            minWidth: 0,
            mx: 0,
            gap: 2,
          }}
        />

        <PrimaryButton
          text="Активные аукционы"
          aria-label="Перейти к активным аукционам"
          variant="outlined"
          size="medium"
          startIcon={<ContentPasteOutlinedIcon />}
          onClick={handleNavigateToTenders}
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
        {isTenderEmplty && (
          <Alert
            severity="info"
            sx={{
              width: {
                xs: "100%",
                sm: isCardsView ? "60%" : "100%",
              },
            }}
          >
            Доступных аукционов нет
          </Alert>
        )}

        {isCardsView && view === VIEWS.cards && (
          <>
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
              {tendersHistory.map((tender) => (
                <ApplicationsTenderCard key={tender.id} tender={tender} />
              ))}
            </Box>
          </>
        )}

        {!isCardsView && !isTenderEmplty && (
          <ApplicationsTenderTable tenders={tendersHistory} />
        )}
      </DataContainer>
      <Pagination
        page={page}
        count={PAGE_COUNT}
        color="primary"
        shape="rounded"
        sx={{
          mt: 6,
          mx: "auto",
          width: "fit-content",
        }}
        onChange={handlePageChange}
      />
    </RootLayout>
  );
};

export default TenderHistory;
