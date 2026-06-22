import React from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";

const LeadCustomerInfo = ({ leadData }) => {
  const customer = leadData?.customer;

  return (
    <Section title="Заказчик" icon={<BusinessOutlinedIcon color="primary" />}>
      <InfoField
        label={customer?.name ? "Имя" : ""}
        value={customer?.name ? leadData.customer.name : "Заказщик не указан"}
      />
    </Section>
  );
};

export default LeadCustomerInfo;
