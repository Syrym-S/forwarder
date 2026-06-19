import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Box, Button, Pagination } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import Loader from "../../components/layout/loader";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";
import ApplicationsTenderCard from "../../components/tenders/applications-tender-card";

const TenderApplications = () => {
  const [view, setView] = useState(VIEWS.cards);
  const [page, setPage] = useState(1);

  const customerTenders = useTendersStore((state) => state.customerTenders);
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const isLoading = useTendersStore((state) => state.isLoading);
  const customerCount = useTendersStore((state) => state.customerCount);
  const customerPerPage = useTendersStore((state) => state.customerPerPage);

  const PAGE_COUNT = Math.ceil(customerCount / customerPerPage);

  console.log("PAGE_COUNT", PAGE_COUNT);
  console.log("customerCount", customerCount);
  console.log("customerPerPage", customerPerPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getCustomerTenders({
      page: page,
    });
  }, [page]);

  console.log(customerTenders);

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      {view === VIEWS.cards && (
        <Box
          sx={{
            display: "grid",
            gap: 5,
            my: "10px",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr",
            },
          }}
        >
          {customerTenders.map((tender) => (
            <ApplicationsTenderCard key={tender.id} tender={tender} />
          ))}
        </Box>
      )}

      <Pagination page={page} count={PAGE_COUNT} onChange={handlePageChange} />
    </RootLayout>
  );
};

export default TenderApplications;
