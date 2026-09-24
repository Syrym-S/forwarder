import { VIEWS } from "../../shared/const/leads";
import { Alert, Box, Pagination } from "@mui/material";
import LeadCard from "./lead-card";
import LeadsTable from "./leads-table";
import LeadKanbanTable from "./lead-kanban-table";
import LeadsTableSkeleton from "./skeleton/leads-table-skeleton";
import PageLoader from "../../shared/ui/loaders/page-loader";

const LeadListContainer = ({
  leads,
  view,
  isLeadsEmpty,
  filterStatus,
  page,
  count,
  perPage,
  isLoading,
  handlePageChange,
}) => {
  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCardsView = view === VIEWS.cards;
  const isTableView = view === VIEWS.table;
  const isKanbanView = view === VIEWS.kanban;

  if (isLoading && isTableView) return <LeadsTableSkeleton />;

  if (isLoading && isCardsView) return <PageLoader />;

  return (
    <>
      {isLeadsEmpty && filterStatus && (
        <Alert
          severity="info"
          sx={{
            width: {
              xs: "100%",
              sm: "60%",
            },
            my: 1,
          }}
        >
          По статусу "{filterStatus.label}" активных перевозок нет!
        </Alert>
      )}
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
          {isLeadsEmpty ? (
            <Alert
              severity="info"
              sx={{
                width: {
                  xs: "100%",
                  sm: "60%",
                },
                my: 1,
              }}
            >
              Список перевозок пуст
            </Alert>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </Box>
      )}
      {isTableView && <LeadsTable leads={leads} />}
      {isKanbanView && <LeadKanbanTable leads={leads} />}
      {!isLeadsEmpty && (
        <Pagination
          shape="rounded"
          page={page}
          count={PAGE_COUNT}
          onChange={handlePageChange}
          sx={{
            width: "fit-content",
            mx: "auto",

            "& .MuiPaginationItem-root": {
              color: "#1F2937",
              fontWeight: 500,
            },

            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff",

              "&:hover": {
                backgroundColor: "primary.main",
              },
            },
          }}
        />
      )}
    </>
  );
};

export default LeadListContainer;
