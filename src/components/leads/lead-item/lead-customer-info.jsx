import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "./lead-detail-section";
import LeadParticipantSkeleton from "../skeleton/lead-participant-skeleton";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import EmptyInfo from "../../../shared/ui/empty/empty-info";

import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import { useState } from "react";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";

const LeadCustomerInfo = ({ leadData, canDetach = false }) => {
  const { t } = useTranslation();

  const [isDetaching, setIsDetaching] = useState(false);

  const detachCustomer = useLeadsStore((state) => state.detachCustomer);
  const isCustomerDetachLoading = useLeadsStore(
    (state) => state.isCustomerDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const customer = leadData?.customer;
  const createdByCustomer = leadData?.created_by === "customer";
  const isNewStatus = leadData?.status === STATUS.new;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;

  const handleDetachCustomer = async () => {
    setIsDetaching(true);
    try {
      await detachCustomer(leadData?.id);
      await getLeadItem(leadData?.id);
    } finally {
      setIsDetaching(false);
    }
  };

  if (isCustomerDetachLoading || isDetaching)
    return (
      <Section
        title={t("ui.customer_details_2")}
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <LeadParticipantSkeleton />
      </Section>
    );

  if (!customer?.name)
    return (
      <Section
        title={t("ui.customer_details_2")}
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <EmptyInfo
          label={t("ui.customer_not_specified")}
          subLabel={t("ui.customer_required_to_start_trip")}
        />
      </Section>
    );

  return (
    <Section
      title={t("ui.customer_details_2")}
      icon={<BusinessOutlinedIcon color="primary" />}
    >
      {(isAddDriverStatus || isNewStatus) && canDetach && (
        <PrimaryButton
          color="error"
          disabled={createdByCustomer}
          variant="outlined"
          onClick={handleDetachCustomer}
          text={t("ui.unassign_customer")}
        />
      )}
      <Box
        className="lead-party-fields"
        sx={theme => ({
          py: 1,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))"
          },
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
              padding: "0"
            }
          }
        })}
      >
        <InfoItem
          className="lead-field-wide"
          label={t("ui.name")}
          value={customer.name}
          sx={theme => ({
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                gridColumn: "1 / -1"
              }
            }
          })}
        />
        <InfoItem label={t("ui.phone")} value={customer.tel} />
        <InfoItem label={t("ui.bin")} value={customer.bin} />
        <InfoItem
          className="lead-field-wide"
          label={t("ui.contact_person")}
          value={customer.contact_person}
          sx={theme => ({
            [theme.breakpoints.down("sm")]: {
              ".lead-details-page &": {
                gridColumn: "1 / -1"
              }
            }
          })}
        />
      </Box>
    </Section>
  );
};

export default LeadCustomerInfo;
