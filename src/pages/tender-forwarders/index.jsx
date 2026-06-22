import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Box, Button, Pagination } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import Loader from "../../components/layout/loader";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";

const defaultValues = {
  lead_id: "",
  public_date_time: "",
  end_date_time: "",
  type: "shipper",
  publication_type: "",
  max_participants: "",
};

const TenderForwarders = () => {
  const [view, setView] = useState(VIEWS.cards);
  const [openForm, setOpenForm] = useState(false);
  const [page, setPage] = useState(1);

  const tenders = useTendersStore((state) => state.tenders);
  const getTenders = useTendersStore((state) => state.getTenders);
  const isLoading = useTendersStore((state) => state.isLoading);
  const count = useTendersStore((state) => state.count);
  const perPage = useTendersStore((state) => state.perPage);

  const PAGE_COUNT = Math.ceil(count / perPage);

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

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Button onClick={handleOpenForm} variant="outlined">
        Создать тендер
      </Button>

      {openForm && (
        <TenderForm
          defaultValues={defaultValues}
          openForm={openForm}
          handleCloseForm={handleCloseForm}
        />
      )}

      {view === VIEWS.cards && (
        <Box
          sx={{
            alignItems: "center",
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr",
            },
          }}
        >
          {tenders.map((tender) => (
            <ForwardersTenderCard key={tender.id} tender={tender} />
          ))}

          <Pagination
            page={page}
            count={PAGE_COUNT}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </RootLayout>
  );
};

export default TenderForwarders;
