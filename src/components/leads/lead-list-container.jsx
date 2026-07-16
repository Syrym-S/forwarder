import { VIEWS } from "../../shared/const/leads";
import { Alert, Box, Pagination } from "@mui/material";
import LeadCard from "./lead-card";
import LeadsTable from "./leads-table";
import PageLoader from "../../shared/ui/loaders/page-loader";
import LeadKanbanTable from "./lead-kanban-table";

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

  if (isLoading) return <PageLoader />;

  return (
    <>
      {isLeadsEmpty &&
        (!filterStatus ? (
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
            Список пуст. Вы можете добавить лид!
          </Alert>
        ) : (
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
            По статусу "{filterStatus.label}" активных лидов нет!
          </Alert>
        ))}
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
      {isTableView && <LeadsTable leads={leads} />}
      {isKanbanView && <LeadKanbanTable leads={leads} />}
      {!isLeadsEmpty && (
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
      )}
    </>
  );
};

export default LeadListContainer;
