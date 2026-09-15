import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import FactoringCard from "../../components/factoring/factoring-card";
import FactoringTable from "../../components/factoring/factoring-table";
import ViewTabs from "../../shared/ui/view-tabs";
import PageLoader from "../../shared/ui/loaders/page-loader";
import FactorLineForm from "../../features/factor-line/factor-line-form";
import SuccessModal from "../../components/factoring/factoring-form/success-modal";
import { Alert, Box, Pagination } from "@mui/material";
import { useNotificationsStore } from "../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../shared/const/notification-types";
import { useEffect, useState } from "react";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import { VIEWS } from "../../shared/const/leads";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import DataContainer from "../../shared/ui/data-container";

const mackFactoring = [
  {
    id: "6aa7d7159c62bc86ed04bb64",
    status: "new",
    deb_summ: 0,
    deb_currency: "KZT",
    currency: "KZT",
    cred_summ: 0,
    proc_service: 0.035,
    proc_factor: 0.035,
    verified_forwarder: false,
    verified_customer: false,
    verified_factor: false,
    date_verified_forwarder: null,
    date_verified_customer: null,
    date_verified_factor: null,
    await_paid_ff: false,
    await_paid_cf: false,
    created_at: {
      date: "2026-09-14 11:14:29.605000",
      timezone_type: 3,
      timezone: "UTC",
    },
    lead_id: "6a96a83ce42ee5b064002a12",
    customer: {
      id: "6a21448d0df91d66fc0d06a2",
      bin: "240640031200",
      fullname: "Customer Tes",
    },
    factor: {
      id: "6a6892e8f5bdcd112a06c5d3",
      bin: "240640031278",
      company_name: "TEST AITU FACTOR",
      company_account: "KZ1292600000123456",
      company_bik: "CASPKZKA",
      company_address: "qwert",
      fio: "TEST AITU FACTOR",
      iin: "030927550619",
      phone: "77074463578",
      email: "testaitu@gmail.com",
    },
  },
];

const Factoring = () => {
  const factorings = mackFactoring;
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
