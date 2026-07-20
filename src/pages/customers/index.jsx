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
import CustomerDetailsModal from "../../components/customers/customer-details-modal";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import EmptyListUI from "../../shared/ui/empty-list-ui";
import PageLoader from "../../shared/ui/loaders/page-loader";
import CustomersTable from "../../components/customers/customer-table";
import { VIEWS } from "../../shared/const/leads";
import ViewTabs from "../../shared/ui/view-tabs";
import AddCustomerForm from "../../features/customer/add-customer-form";
import InviteLinkModal from "../../components/customers/invite-link-modal";
import CustomerListContainer from "../../components/customers/customer-list-container";

const Customers = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  //Позже венру если нужно будет , показывает по какому слово пошел запрос поиска
  const [__, setSearchRequest] = useState("");
  const [inputValue, setInputValue] = useState("");

  const getCustomers = useCustomerStore((state) => state.getCustomers);

  const searchCustomers = useCustomerStore((state) => state.searchCustomers);
  const inviteLink = useCustomerStore((state) => state.inviteLink);
  const clearInviteLink = useCustomerStore((state) => state.clearInviteLink);

  const isCardsView = view === VIEWS.cards;

  const handleOpenForm = () => {
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
  };

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
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        <ViewTabs
          view={view}
          setView={setView}
          handleOpenForm={handleOpenForm}
          buttonText="Пригласить заказщика"
        />

        {open && <AddCustomerForm open={open} handleClose={handleCloseForm} />}

        {inviteLink && (
          <InviteLinkModal
            inviteLink={inviteLink}
            clearInviteLink={clearInviteLink}
          />
        )}

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
            width: {
              xs: "100%",
              sm: "300px",
            },
            borderRadius: "50px",
            zIndex: 0,
          }}
        />
      </Box>

      <CustomerListContainer view={view} />
    </RootLayout>
  );
};

export default Customers;
