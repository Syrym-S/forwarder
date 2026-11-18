import ViewTabs from "../../shared/ui/view-tabs";
import TableSkeleton from "../../shared/ui/table-skeleton";
import CardListSkeleton from "../../shared/ui/card-list-skeleton";
import CreateAdvertisement from "../../features/advertisements/create-advertisement";
import {
  Alert,
  Box,
  Button,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VIEWS } from "../../shared/const/leads";
import { getAdvertisementAccess, getAvailableAdvertisementType } from "../../shared/lib/advertisement-features";
import { useAdvertisementsStore } from "../../app/store/advertisements/advertisements-store";
import AdvertisementCard from "./advertisement-card";
import AdvertisementsTable from "./advertisements-table";

const MainContainer = () => {
  const { t } = useTranslation();

  const [view, setView] = useState(VIEWS.table);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const selectedType = useAdvertisementsStore((state) => state.type);
  const page = useAdvertisementsStore((state) => state.page);
  const perPage = useAdvertisementsStore((state) => state.perPage);
  const totalPages = useAdvertisementsStore((state) => state.totalPages);
  const advertisements = useAdvertisementsStore(
    (state) => state.advertisements,
  );
  const isListLoading = useAdvertisementsStore((state) => state.isLoading);
  const error = useAdvertisementsStore((state) => state.error);
  const setType = useAdvertisementsStore((state) => state.setType);
  const setPage = useAdvertisementsStore((state) => state.setPage);
  const getAdvertisements = useAdvertisementsStore(
    (state) => state.getAdvertisements,
  );

  const access = getAdvertisementAccess(window.APP_DATA?.features);
  const type = getAvailableAdvertisementType(selectedType, access);
  const isMyAdvertisements = type === "my";
  const isLoading = isListLoading || selectedType !== type;
  const hideTabs = !access.my || !access.customer;

  useEffect(() => {
    const currentType = useAdvertisementsStore.getState().type;
    const availableType = getAvailableAdvertisementType(currentType, {
      my: access.my,
      customer: access.customer,
    });
    if (!availableType) return;
    if (currentType !== availableType) setType(availableType);
    else getAdvertisements();
  }, [access.my, access.customer, getAdvertisements, setType]);

  if (!type) return null;

  return (
    <Box sx={{ mt: 3 }}>
      {!hideTabs && (
        <Tabs
          value={type}
          onChange={(_, value) => {
            setType(value);
            setIsCreateModalOpen(false);
          }}
          variant="scrollable"
          scrollButtons="auto"
          aria-label={t("advertisements.heading")}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            value="my"
            label={t("advertisements.my_tab")}
            id="advertisements-tab-my"
            aria-controls="advertisements-panel-my"
            wrapped
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
          <Tab
            value="customer"
            label={t("advertisements.customer_tab")}
            id="advertisements-tab-customer"
            aria-controls="advertisements-panel-customer"
            wrapped
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>
      )}

      <Box
        role={hideTabs ? "region" : "tabpanel"}
        id={`advertisements-panel-${type}`}
        aria-labelledby={hideTabs ? undefined : `advertisements-tab-${type}`}
        aria-label={hideTabs ? t(isMyAdvertisements ? "advertisements.my_tab" : "advertisements.customer_tab") : undefined}
        sx={{ mt: 2 }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          withoutKanban
          withoutDataAdd={!isMyAdvertisements}
          buttonText={t("advertisements.create")}
          handleOpenForm={() => setIsCreateModalOpen(true)}
          sx={{ width: "100%", gap: 2, flexWrap: "wrap" }}
        />

        {isLoading && (
          <Box sx={{ mt: 2 }}>
            {view === VIEWS.cards ? (
              <CardListSkeleton
                count={4}
                sx={{
                  width: "100%",
                  mx: 0,
                  my: 0,
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    xl: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              />
            ) : (
              <TableSkeleton />
            )}
          </Box>
        )}

        {!isLoading && error && (
          <Alert
            severity="error"
            sx={{ mt: 2 }}
            action={
              <Button color="inherit" onClick={() => getAdvertisements()}>
                {t("ui.retry")}
              </Button>
            }
          >
            {typeof error === "string" ? error : t("dashboard.loading_error")}
          </Alert>
        )}

        {!isLoading && !error && (
          <Box sx={{ mt: 2 }}>
            {advertisements.length === 0 ? (
              <Alert severity="info">{t("advertisements.empty_list")}</Alert>
            ) : view === VIEWS.cards ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "minmax(0, 1fr)",
                    xl: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {advertisements.map((advertisement) => (
                  <AdvertisementCard
                    key={advertisement.id}
                    advertisement={advertisement}
                    source={type}
                  />
                ))}
              </Box>
            ) : (
              <AdvertisementsTable
                advertisements={advertisements}
                source={type}
              />
            )}

            {totalPages !== null
              ? totalPages > 1 && (
                  <Pagination
                    page={page}
                    count={totalPages}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                    sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                  />
                )
              : (page > 1 || advertisements.length === perPage) && (
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ mt: 3 }}
                  >
                    <Button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      {t("ui.back")}
                    </Button>
                    <Typography>{page}</Typography>
                    <Button
                      disabled={advertisements.length < perPage}
                      onClick={() => setPage(page + 1)}
                    >
                      {t("ui.next")}
                    </Button>
                  </Stack>
                )}
          </Box>
        )}
      </Box>

      <CreateAdvertisement
        open={isCreateModalOpen && isMyAdvertisements}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
};

export default MainContainer;
