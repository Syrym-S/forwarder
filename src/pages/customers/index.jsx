import { useTranslation } from "react-i18next";
import RootLayout from "../../components/layout/root-layout";
import ViewTabs from "../../shared/ui/view-tabs";
import AddCustomerForm from "../../features/customer/add-customer-form";
import InviteLinkModal from "../../components/customers/invite-link-modal";
import CustomerListContainer from "../../components/customers/customer-list-container";
import { Box, Typography } from "@mui/material";
import FormInput from "../../shared/ui/input/form-input";
import { useEffect, useState } from "react";
import { useCustomerStore } from "../../app/store/customers/customers-store";
import { VIEWS } from "../../shared/const/leads";

const Customers = () => {
  const { t } = useTranslation();
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
      <Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.5rem",
            сolor: "font_color.heading",
          }}
        >{t("ui.customers")}</Typography>

        <Typography color="text.secondary" fontSize={14}>{t("ui.customer_list")}</Typography>
      </Box>

      <Box
        sx={{
          mx: "auto",
          width: {
            xs: "100%",
            sm: isCardsView ? "60%" : "100%",
          },
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1,
          justifyContent: "space-between",
        }}
      >
        <ViewTabs
          view={view}
          withoutKanban
          setView={setView}
          handleOpenForm={handleOpenForm}
          buttonText={t("ui.invite_customer")}
          sx={{ width: { xs: "100%", sm: "auto" }, flex: { sm: 1 }, minWidth: 0, mx: 0, gap: 2 }}
        />

        {open && <AddCustomerForm open={open} handleClose={handleCloseForm} />}

        {inviteLink && (
          <InviteLinkModal
            inviteLink={inviteLink}
            clearInviteLink={clearInviteLink}
          />
        )}

        <FormInput
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          label={t("ui.search_customer")}
          fullWidth
          size="small"
          sx={{
            width: { xs: "100%", sm: 300 },
            maxWidth: { sm: 300 },
            minWidth: 0,
            flexShrink: 1,
            ml: { sm: "auto" },
            my: 1,
          }}
        />
      </Box>

      <CustomerListContainer view={view} />
    </RootLayout>
  );
};

export default Customers;
