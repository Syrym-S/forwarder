import { useTranslation } from "react-i18next";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import Section from "./lead-detail-section";
import { Box, CircularProgress } from "@mui/material";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { STATUS } from "../../../shared/const/tenders";
import { InfoBadge } from "../../lead-form/info-badge";
import InfoItem from "../../../shared/ui/info-item";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import EmptyInfo from "../../../shared/ui/empty/empty-info";

const LeadCustomerInfo = ({ leadData, canDetach = false }) => {
  const { t } = useTranslation();
  const customer = leadData?.customer;

  const createdByCustomer = leadData?.created_by === "customer";

  const isNewStatus = leadData?.status === STATUS.new;
  const isAddDriverStatus = leadData?.status === STATUS.add_driver;

  const detachCustomer = useLeadsStore((state) => state.detachCustomer);
  const isCustomerDetachLoading = useLeadsStore(
    (state) => state.isCustomerDetachLoading,
  );
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const handleDetachCustomer = async () => {
    await detachCustomer(leadData?.id);
    await getLeadItem(leadData?.id);
  };

  if (isCustomerDetachLoading)
    return (
      <Section
        title={t("ui.customer_details_2")}
        icon={<BusinessOutlinedIcon color="primary" />}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
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
        sx={{
          py: 1,
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
          },
        }}
      >
        <InfoItem label={t("ui.name")} value={customer.name} />
        <InfoItem label={t("ui.phone")} value={customer.tel} />
        <InfoItem label={t("ui.bin")} value={customer.bin} />
        <InfoItem label={t("ui.contact_person")} value={customer.contact_person} />
      </Box>
    </Section>
  );
};

export default LeadCustomerInfo;
