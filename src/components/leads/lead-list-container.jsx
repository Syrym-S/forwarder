import { useEffect } from "react";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useState } from "react";
import { VIEWS } from "../../shared/const/leads";
import { Box, Pagination } from "@mui/material";
import LeadCard from "./lead-card";
import LeadsTable from "./leads-table";
import PageLoader from "../../shared/ui/loaders/page-loader";

const LeadListContainer = ({ view }) => {
  const [page, setPage] = useState(1);

  const leads = useLeadsStore((state) => state.leads);
  const count = useLeadsStore((state) => state.count);
  const perPage = useLeadsStore((state) => state.perPage);
  const fetchLeads = useLeadsStore((state) => state.fetchLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCardsView = view === VIEWS.cards;

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchLeads({
      page: page,
    });
  }, [page]);

  if (isLoading) return <PageLoader />;

  return (
    <>
      {isCardsView && (
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
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </Box>
      )}
      {!isCardsView && <LeadsTable leads={leads} />}
      <Pagination
        color="primary"
        shape="rounded"
        page={page}
        count={PAGE_COUNT}
        onChange={handlePageChange}
        color="primary"
        shape="rounded"
        sx={{
          width: "fit-content",
          mx: "auto",
        }}
      />
    </>
  );
};

export default LeadListContainer;
