import { Box, Dialog, DialogTitle } from "@mui/material";
import { useCustomerStore } from "../../app/store/customer";
import RootLayout from "../../components/layout/root-layout";
import Loader from "../../components/layout/loader";
import { useEffect, useState } from "react";
import CustomerCard from "../../components/customers/customer-card";
import { useSearchParams } from "react-router-dom";
import CustomerDetailsModal from "../../components/customers/customer-details-modal";

const Customers = () => {
  const [_, setSearchParams] = useSearchParams();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = useCustomerStore((state) => state.customers);
  const getCustomers = useCustomerStore((state) => state.getCustomers);
  const getCustomerDetails = useCustomerStore(
    (state) => state.getCustomerDetails,
  );

  const handleClear = () => {
    setSelectedCustomer(null);
    setSearchParams("");
  };

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setSearchParams({
        customer_id: selectedCustomer?.id,
      });

      getCustomerDetails(selectedCustomer?.id);
    }
  }, [selectedCustomer]);

  if (!customers) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          width: "60%",
          mx: "auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 5,
        }}
      >
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            setSelectedCustomer={setSelectedCustomer}
          />
        ))}

        {selectedCustomer && (
          <CustomerDetailsModal
            selectedCustomer={selectedCustomer}
            handleClear={handleClear}
          />
        )}
      </Box>
    </RootLayout>
  );
};

export default Customers;
