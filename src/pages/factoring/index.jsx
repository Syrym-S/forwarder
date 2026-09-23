import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import FactoringCard from "../../components/factoring/factoring-card";
import FactoringTable from "../../components/factoring/factoring-table";
import ViewTabs from "../../shared/ui/view-tabs";
import FactorLineForm from "../../features/factor-line/factor-line-form";
import SuccessModal from "../../components/factoring/factoring-form/success-modal";
import DataContainer from "../../shared/ui/data-container";
import { Box, Pagination, Typography } from "@mui/material";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { useEffect, useState } from "react";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import { VIEWS } from "../../shared/const/leads";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const Factoring = () => {
  const factorings = useFactoringStore((state) => state.factorings);
  const isLoading = useFactoringStore((state) => state.isLoading);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const clearFactoringDetails = useFactoringStore(
    (state) => state.clearFactoringDetails,
  );
  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );

  const count = useFactoringStore((state) => state.count);
  const perPage = useFactoringStore((state) => state.perPage);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [openFactoringLineForm, setOpenFactoringLineForm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCradsView = view === VIEWS.cards;
  const isFactoringsEmpty = factorings.length === 0;

  const handleModalOpen = () => {
    setOpenFormModal(true);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleModalClose = () => {
    setOpenFormModal(false);
  };

  useEffect(() => {
    getFactorings({
      page: page,
    });
  }, [page]);

  useEffect(() => {
    clearFactoringDetails();
    clearCurrentLead();
  }, []);

  const { notification_type } = parserNotificationType(
    newNotification?.type || "",
  );

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.factor) {
      getFactorings();
    }
  }, [newNotification, notification_type, getFactorings]);

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
          Факторинги
        </Typography>

        <Typography color="text.secondary" fontSize={14}>
          Факторинги по завершенным перевозкам
        </Typography>
      </Box>
      <ViewTabs
        view={view}
        setView={setView}
        withoutKanban
        handleOpenForm={handleModalOpen}
      />
      <DataContainer
        isLoading={isLoading}
        isEmpty={isFactoringsEmpty}
        emptyText="Доступных факторингов нет"
      >
        {isCradsView && (
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
            {factorings.map((factoring) => (
              <FactoringCard factoring={factoring} key={factoring.id} />
            ))}
          </Box>
        )}

        {!isCradsView && <FactoringTable factorings={factorings} />}
      </DataContainer>
      <Pagination
        sx={{
          mx: "auto",
          width: "fit-content",
        }}
        color="primary"
        shape="rounded"
        page={page}
        count={PAGE_COUNT}
        onChange={handlePageChange}
      />
      {openFormModal && (
        <CreateFactoringForm
          openFormModal={openFormModal}
          handleModalClose={handleModalClose}
          setOpenFactoringLineForm={setOpenFactoringLineForm}
        />
      )}
      {openFactoringLineForm && (
        <FactorLineForm
          open={openFactoringLineForm}
          setOpenForm={setOpenFactoringLineForm}
          setSuccessModal={setSuccessModal}
        />
      )}
      {successModal && (
        <SuccessModal open={successModal} setOpen={setSuccessModal} />
      )}
    </RootLayout>
  );
};

export default Factoring;
