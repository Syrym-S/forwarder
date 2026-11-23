import LeadCard from "./lead-card";
import CompactLeadCard from "./compact-lead-card";
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
  compactCards = false,
}) => {
  const { t } = useTranslation();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const PAGE_COUNT = Math.max(1, Math.ceil(count / Math.max(perPage, 1)));
  const isCardsView = view === VIEWS.cards;
  const isTableView = view === VIEWS.table;
  const isKanbanView = view === VIEWS.kanban;
  const CardComponent = compactCards ? CompactLeadCard : LeadCard;
  const cardsLayout = {
    width: { xs: "100%", sm: "60%" },
    mx: "auto",
    display: "grid",
    my: "10px",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: compactCards ? 1.5 : 3,
  };

  if (isLoading && isTableView) return <TableSkeleton />;

  if (isLoading && isCardsView) return <CardListSkeleton sx={cardsLayout} />;

  return (
    <>
      {!isLoading && isLeadsEmpty && (
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
          {filterStatus
            ? t("active_leads.empty_status", { status: t(filterStatus.label) })
            : t("active_leads.empty_list")}
        </Alert>
      )}

      {isCardsView && !isLeadsEmpty && (
        <Box sx={cardsLayout}>
          {leads.map((lead) => (
            <CardComponent key={lead.id} lead={lead} />
          ))}
        </Box>
      )}

      {isTableView && !isLeadsEmpty && (
        <LeadsTable leads={leads} responsive={responsive} />
      )}

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
              ...(responsive
                ? { minWidth: { xs: 36, sm: 40 }, height: { xs: 44, sm: 40 } }
                : {}),
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
