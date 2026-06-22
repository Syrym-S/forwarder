import React from "react";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const LeadDriverInfo = ({ leadData }) => {
  const driver = leadData?.driver;

  return (
    <Section title="Водитель" icon={<PersonOutlinedIcon color="primary" />}>
      <InfoField
        label={driver.fio ? "ФИО" : ""}
        value={driver.fio ? driver.fio : "Водитель не указан"}
      />
    </Section>
  );
};

export default LeadDriverInfo;
