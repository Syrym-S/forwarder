import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import { VIEWS } from "../../shared/const/leads";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Pagination, useMediaQuery } from "@mui/material";
import CardListSkeleton from "../../shared/ui/card-list-skeleton";
import TableSkeleton from "../../shared/ui/table-skeleton";
import CustomersTable from "./customer-table";
import CustomerCard from "./customer-card";
import CustomerDetailsModal from "./customer-details-modal";

const CustomerListContainer = ({ view, page, onPageChange }) => {
  const { t } = useTranslation();
  const isCompactScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [_, setSearchParams] = useSearchParams();

  const customers = useCustomerStore((state) => state.customers);
  const getCustomerDetails = useCustomerStore(
    (state) => state.getCustomerDetails,
  );
  const isLoading = useCustomerStore((state) => state.isLoading);
  const count = useCustomerStore((state) => state.count);
  const perPage = useCustomerStore((state) => state.perPage);
  const clearCustomerDetails = useCustomerStore(
    (state) => state.clearCustomerDetails,
  );

  const isCardsView = view === VIEWS.cards;

  const isEmpty = customers?.length === 0;
  const PAGE_COUNT = Math.ceil(count / perPage);

  const handleClear = () => {
    setSelectedCustomer(null);
    setSearchParams("");
    clearCustomerDetails();
  };

  useEffect(() => {
    if (selectedCustomer) {
      setSearchParams({
        customer_id: selectedCustomer?.id,
      });

      getCustomerDetails(selectedCustomer?.id);
    }
  }, [selectedCustomer]);

  if (isLoading) return isCardsView ? <CardListSkeleton /> : <TableSkeleton />;

  return (
    <Box sx={{ minWidth: 0 }}>
      {!isCardsView && (
        <CustomersTable
          customers={customers}
          setSelectedCustomer={setSelectedCustomer}
        />
      )}

      <Box
        sx={{
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          mx: "auto",
          minWidth: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: { xs: 1.5, sm: 3 },
          mt: isCardsView ? 0 : 2,
        }}
      >
        {isCardsView &&
          (isEmpty ? (
            <Alert
              severity="info"
              sx={{
                width: "100%",
                my: 1,
              }}
            >
              {t("ui.customer_list_empty")}
            </Alert>
          ) : (
            customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                setSelectedCustomer={setSelectedCustomer}
              />
            ))
          ))}

        {selectedCustomer && (
          <CustomerDetailsModal
            selectedCustomer={selectedCustomer}
            handleClear={handleClear}
          />
        )}

        {!isEmpty && (
          <Pagination
            sx={{
              mx: "auto",
              maxWidth: "100%",
              "& .MuiPagination-ul": { justifyContent: "center" },
            }}
            color="primary"
            shape="rounded"
            size={isCompactScreen ? "small" : "medium"}
            siblingCount={isCompactScreen ? 0 : 1}
            page={page}
            count={PAGE_COUNT}
            onChange={onPageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default CustomerListContainer;
