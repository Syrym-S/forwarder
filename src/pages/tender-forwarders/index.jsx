import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Box, Pagination, TextField } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";
import PageLoader from "../../shared/ui/loaders/page-loader";
import ViewTabs from "../../shared/ui/view-tabs";
import ForwardersTenderTable from "../../components/tenders/forwarders-tender-table";
import EmptyListUi from "../../shared/ui/common/empty-list-ui";
import DataContainer from "../../shared/ui/data-container";

const defaultValues = {
  lead: null,
  public_date_time: "",
  end_date_time: "",
  type: "shipper",
  publication_type: "",
  max_participants: null,
};

const TenderForwarders = () => {
  const [view, setView] = useState(VIEWS.table);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const tenders = useTendersStore((state) => state.tenders);
  const getTenders = useTendersStore((state) => state.getTenders);
  const isLoading = useTendersStore((state) => state.isLoading);
  const count = useTendersStore((state) => state.count);
  const perPage = useTendersStore((state) => state.perPage);
  const clearCurrentTender = useTendersStore(
    (state) => state.clearCurrentTender,
  );

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isTendersEmpty = tenders?.length === 0;
  const isCardsView = view === VIEWS.cards;

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

  useEffect(() => {
    const value = inputValue?.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getTenders();

        return;
      }

      if (value.length >= 2) {
        getTenders({ q: value });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <RootLayout withoutDataCheck>
      <Box>
        <Box
          sx={{
            mx: "auto",
            display: "flex",
            gap: 1,
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
            handleOpenForm={handleOpenForm}
          />

          <TextField
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            label="Поиск тендера"
            fullWidth
            size="small"
            sx={{
              display: "block",
              my: 1,
              width: {
                xs: "100%",
                sm: "300px",
              },
              borderRadius: "50px",
              zIndex: 0,
            }}
          />
        </Box>

        {openForm && (
          <TenderForm
            defaultValues={defaultValues}
            openForm={openForm}
            handleCloseForm={handleCloseForm}
          />
        )}

        <DataContainer isLoading={isLoading}>
          {isCardsView && (
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
                gridTemplateColumns: "1fr",
              }}
            >
              {isTendersEmpty ? (
                <EmptyListUi text="Список пуст. Добавьте аукцион!" />
              ) : (
                tenders.map((tender) => (
                  <ForwardersTenderCard key={tender.id} tender={tender} />
                ))
              )}
            </Box>
          )}

          {!isCardsView && <ForwardersTenderTable tenders={tenders} />}

          {!isTendersEmpty && (
            <Pagination
              sx={{
                my: 4,
                mx: "auto",
                width: "fit-content",
              }}
              page={page}
              color="primary"
              shape="rounded"
              count={PAGE_COUNT}
              onChange={handlePageChange}
            />
          )}
        </DataContainer>
      </Box>
    </RootLayout>
  );
};

export default TenderForwarders;
