import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RootLayout from "../../components/layout/root-layout";
import Loader from "../../components/layout/loader";
import { useEffect, useState } from "react";
import CustomerCard from "../../components/customers/customer-card";
import { useSearchParams } from "react-router-dom";
import CustomerDetailsModal from "../../components/customers/customer-details-modal";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import PageLoader from "../../shared/ui/loaders/page-loader";
import CustomersTable from "../../components/customers/customer-table";
import { VIEWS } from "../../shared/const/leads";
import ViewTabs from "../../shared/ui/view-tabs";

const Customers = () => {
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);
  //Позже венру если нужно будет , показывает по какому слово пошел запрос поиска
  const [__, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [_, setSearchParams] = useSearchParams();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = useCustomerStore((state) => state.customers);
  const isLoading = useCustomerStore((state) => state.isLoading);
  const getCustomers = useCustomerStore((state) => state.getCustomers);
  const getCustomerDetails = useCustomerStore(
    (state) => state.getCustomerDetails,
  );
  const count = useCustomerStore((state) => state.count);
  const perPage = useCustomerStore((state) => state.perPage);
  const searchCustomers = useCustomerStore((state) => state.searchCustomers);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isEmpty = customers?.length === 0;
  const isCardsView = view === VIEWS.cards;

  const handleClear = () => {
    setSelectedCustomer(null);
    setSearchParams("");
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  useEffect(() => {
    getCustomers({
      page: page,
    });
  }, [page]);

  useEffect(() => {
    if (selectedCustomer) {
      setSearchParams({
        customer_id: selectedCustomer?.id,
      });

      getCustomerDetails(selectedCustomer?.id);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    const value = inputValue?.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getCustomers();
        setSearchRequest("");

        return;
      }

      if (value.length >= 2) {
        searchCustomers({ q: value });
        setSearchRequest(value);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  if (isLoading)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ViewTabs view={view} setView={setView} withoutDataAdd />
        <TextField
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label="Поиск заказщика"
          fullWidth
          size="small"
          sx={{
            display: "block",
            my: 1,
            width: "300px",
            borderRadius: "50px",
          }}
        />
      </Box>

      {/* <Stack
        sx={{
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          mx: "auto",
        }}
      >
        {searchRequest && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: "600",
              }}
            >
              Результат по поиску:
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: "300",
                fontStyle: "italic",
              }}
            >
              {searchRequest}
            </Typography>
          </Box>
        )}
      </Stack> */}

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

        {!isCardsView && <CustomersTable customers={customers} />}

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
    </RootLayout>
  );
};

export default Customers;
