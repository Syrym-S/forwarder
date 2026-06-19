import React from "react";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";

const LeadCustomerInfo = ({ leadData }) => {
  return (
    <Section title="Заказчик" icon={<BusinessOutlinedIcon color="primary" />}>
      <InfoField label="Название" value={leadData.customer.name} />
    </Section>
  );
};

export default LeadCustomerInfo;
