import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Alert, Box, Button, Pagination } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import Loader from "../../components/layout/loader";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";
import PageLoader from "../../shared/ui/loaders/page-loader";

const defaultValues = {
  lead: null,
  public_date_time: "",
  end_date_time: "",
  type: "shipper",
  publication_type: "",
  max_participants: null,
};

const TenderForwarders = () => {
  const view = VIEWS.cards;
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);

  const tenders = useTendersStore((state) => state.tenders);
  const getTenders = useTendersStore((state) => state.getTenders);
  const isLoading = useTendersStore((state) => state.isLoading);
  const count = useTendersStore((state) => state.count);
  const perPage = useTendersStore((state) => state.perPage);
  const clearCurrentTender = useTendersStore(
    (state) => state.clearCurrentTender,
  );

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isTendersEmpty = tenders.length === 0;

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  useEffect(() => {
    getTenders({
      page: page,
    });
  }, [page]);

  useEffect(() => {
    clearCurrentTender();
  }, []);

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
          width: {
            xs: "100%",
            sm: "60%",
          },
          mx: "auto",
        }}
      >
        <Button onClick={handleOpenForm} variant="outlined">
          Создать тендер
        </Button>
      </Box>

      {openForm && (
        <TenderForm
          defaultValues={defaultValues}
          openForm={openForm}
          handleCloseForm={handleCloseForm}
        />
      )}

      {isTendersEmpty && (
        <Alert
          severity="info"
          sx={{
            width: {
              xs: "100%",
              sm: "60%",
            },
            my: 1,
            mx: "auto",
          }}
        >
          Список пуст. Добавьте тендер!
        </Alert>
      )}

      {view === VIEWS.cards && (
        <Box
          sx={{
            mx: "auto",
            width: {
              xs: "100%",
              sm: "60%",
            },
            alignItems: "center",
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
            },
          }}
        >
          {tenders.map((tender) => (
            <ForwardersTenderCard key={tender.id} tender={tender} />
          ))}

          {!isTendersEmpty && (
            <Pagination
              sx={{
                mx: "auto",
              }}
              page={page}
              color="primary"
              shape="rounded"
              count={PAGE_COUNT}
              onChange={handlePageChange}
            />
          )}
        </Box>
      )}
    </RootLayout>
  );
};

export default TenderForwarders;
