import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import { VIEWS } from "../../shared/const/leads";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Pagination } from "@mui/material";
import PageLoader from "../../shared/ui/loaders/page-loader";
import TableSkeleton from "../../shared/ui/table-skeleton";
import CustomersTable from "./customer-table";
import CustomerCard from "./customer-card";
import CustomerDetailsModal from "./customer-details-modal";

const CustomerListContainer = ({ view, page, onPageChange }) => {
  const { t } = useTranslation();
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

  if (isLoading) return isCardsView ? <PageLoader /> : <TableSkeleton />;

  return (
    <Box>
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
          display: "grid",
          gap: 5,
        }}
      >
        {isCardsView &&
          (isEmpty ? (
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
              {t("ui.customer_list_empty")}
            </Alert>
          ) : (
            customers.map((customer) => (
              <>
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  setSelectedCustomer={setSelectedCustomer}
                />
              </>
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
            }}
            color="primary"
            shape="rounded"
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
