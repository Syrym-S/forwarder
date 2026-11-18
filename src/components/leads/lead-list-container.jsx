import LeadCard from "./lead-card";
import LeadsTable from "./leads-table";
import LeadKanbanTable from "./lead-kanban-table";
import TableSkeleton from "../../shared/ui/table-skeleton";
import CardListSkeleton from "../../shared/ui/card-list-skeleton";

import { useTranslation } from "react-i18next";
import { VIEWS } from "../../shared/const/leads";
import { Alert, Box, Pagination, useMediaQuery } from "@mui/material";

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
  responsive = false,
}) => {
  const { t } = useTranslation();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCardsView = view === VIEWS.cards;
  const isTableView = view === VIEWS.table;
  const isKanbanView = view === VIEWS.kanban;
  const cardsLayout = {
    width: { xs: "100%", sm: "60%" },
    mx: "auto",
    display: "grid",
    my: "10px",
    gridTemplateColumns: "1fr",
  };

  if (isLoading && isTableView) return <TableSkeleton />;

  if (isLoading && isCardsView) return <CardListSkeleton sx={cardsLayout} />;

  return (
    <>
      {!isLoading && isLeadsEmpty && filterStatus && (
        <Alert
          severity="info"
          sx={{
            width: responsive
              ? "100%"
              : {
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
        <Box sx={cardsLayout}>
          {isLeadsEmpty ? (
            <Alert
              severity="info"
              sx={{
                width: responsive
                  ? "100%"
                  : {
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

      {isTableView && <LeadsTable leads={leads} responsive={responsive} />}

      {isKanbanView && <LeadKanbanTable leads={leads} />}

      {!isLoading && !isLeadsEmpty && (
        <Pagination
          size={responsive && isSmallScreen ? "small" : "medium"}
          siblingCount={responsive && isSmallScreen ? 0 : 1}
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
            maxWidth: "100%",
            ...(responsive ? { my: 3 } : {}),
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
