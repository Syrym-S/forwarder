import { VIEWS } from "../../shared/const/leads";
import { Alert, Box, Pagination } from "@mui/material";
import LeadCard from "./lead-card";
import LeadsTable from "./leads-table";
import LeadKanbanTable from "./lead-kanban-table";
import LeadsTableSkeleton from "./skeleton/leads-table-skeleton";
import PageLoader from "../../shared/ui/loaders/page-loader";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          {t("active_leads.empty_status", { status: t(filterStatus.label) })}
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
              {t("active_leads.empty_list")}
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
          aria-label={t("active_leads.pagination.label")}
          getItemAriaLabel={(type, pageNumber, selected) => {
            if (type.endsWith("ellipsis")) return undefined;
            return t(
              `active_leads.pagination.${type === "page" && selected ? "selected_page" : type}`,
              { page: pageNumber },
            );
          }}
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
