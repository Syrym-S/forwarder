import React from "react";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const LeadDriverInfo = ({ leadData }) => {
  return (
    <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
      <InfoField label="ФИО" value={leadData.driver.fio} />
    </Section>
  );
};

export default LeadDriverInfo;
