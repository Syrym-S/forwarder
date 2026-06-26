import React from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import { Box, Button } from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";

const LeadCustomerInfo = ({ leadData }) => {
  const customer = leadData?.customer;

  const isNewStatus = leadData?.status === STATUS.new;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;
  const detachCustomer = useLeadsStore((state) => state.detachCustomer);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const handleDetachDriver = async () => {
    await detachCustomer(leadData?.id);
    await getLeadItem(leadData?.id);
  };

  if (!customer?.name)
    return (
      <Section
        title="Данные о заказщике"
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <InfoField label={""} value={"Заказщик не указан"} />
      </Section>
    );

  return (
    <Section
      title="Данные о заказщике"
      icon={<BusinessOutlinedIcon color="primary" />}
    >
      {(isAddDriverStatus || isNewStatus) && (
        <Button color="error" variant="outlined" onClick={handleDetachDriver}>
          Отвязать Заказщика
        </Button>
      )}
      <Box
        sx={{
          py: 1,
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(3, 1fr)",
          },
        }}
      >
        <InfoField label={"Имя"} value={customer.name} />
        <InfoField label={"Номер телефона"} value={customer.tel} />
        <InfoField label={"БИН"} value={customer.bin} />
        <InfoField label={"Контактное лицо"} value={customer.contact_person} />
      </Box>
    </Section>
  );
};

export default LeadCustomerInfo;
