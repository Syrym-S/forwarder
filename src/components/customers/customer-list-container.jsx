import React, { useEffect, useState } from "react";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import { VIEWS } from "../../shared/const/leads";
import { useSearchParams } from "react-router-dom";
import { Box, Pagination } from "@mui/material";
import RootLayout from "../layout/root-layout";
import PageLoader from "../../shared/ui/loaders/page-loader";
import CustomersTable from "./customer-table";
import CustomerCard from "./customer-card";
import CustomerDetailsModal from "./customer-details-modal";
import EmptyListUI from "../../shared/ui/empty-list-ui";

const CustomerListContainer = ({ view }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [page, setPage] = useState(1);
  const [_, setSearchParams] = useSearchParams();

  const customers = useCustomerStore((state) => state.customers);
  const getCustomerDetails = useCustomerStore(
    (state) => state.getCustomerDetails,
  );
  const isLoading = useCustomerStore((state) => state.isLoading);
  const getCustomers = useCustomerStore((state) => state.getCustomers);
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

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (selectedCustomer) {
      setSearchParams({
        customer_id: selectedCustomer?.id,
      });

      getCustomerDetails(selectedCustomer?.id);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    getCustomers({
      page: page,
    });
  }, [page]);

  if (isLoading) return <PageLoader />;

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
          customers.map((customer) => (
            <>
              <CustomerCard
                key={customer.id}
                customer={customer}
                setSelectedCustomer={setSelectedCustomer}
              />
            </>
          ))}

        {isEmpty && <>{isLoading ? <PageLoader /> : <EmptyListUI />}</>}

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
            onChange={handlePageChange}
          />
        )}
      </Box>
    </Box>
  );
};

export default CustomerListContainer;
