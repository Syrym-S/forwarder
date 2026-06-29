import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { Box, Button, Pagination } from "@mui/material";
import TenderForm from "../../features/tenders/tender-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { VIEWS } from "../../shared/const/leads";
import Loader from "../../components/layout/loader";
import ForwardersTenderCard from "../../components/tenders/forwarders-tender-card";
import ApplicationsTenderCard from "../../components/tenders/applications-tender-card";
import PageLoader from "../../shared/ui/loaders/page-loader";

const TenderApplications = () => {
  const view = VIEWS.cards;
  const [page, setPage] = useState(1);

  const customerTenders = useTendersStore((state) => state.customerTenders);
  const getCustomerTenders = useTendersStore(
    (state) => state.getCustomerTenders,
  );
  const customerCount = useTendersStore((state) => state.customerCount);
  const customerPerPage = useTendersStore((state) => state.customerPerPage);

  const PAGE_COUNT = Math.ceil(customerCount / customerPerPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getCustomerTenders({
      page: page,
    });
  }, [page]);

  const isTenderEmplty = customerTenders.length === 0;

  if (isTenderEmplty)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      {view === VIEWS.cards && (
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
          <Pagination
            page={page}
            count={PAGE_COUNT}
            sx={{
              mx: "auto",
            }}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </RootLayout>
  );
};

export default TenderApplications;
