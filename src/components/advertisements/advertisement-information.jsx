import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import Section from "../leads/lead-item/lead-detail-section";
import InfoItem from "../../shared/ui/info-item";
import ContactValue from "../../shared/ui/contact-value";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { formatAdvertisementDate } from "../../features/advertisements/model";
import { ROLES } from "../../shared/const/roles";

const AdvertisementInformation = ({ advertisement }) => {
  const { t } = useTranslation();
  const source =
    advertisement.type_source === ROLES.forwarder
      ? t("advertisements.source_forwarder")
      : advertisement.type_source === ROLES.customer
        ? t("ui.customer")
        : advertisement.type_source;

  const isCustomerCreated = advertisement.type_source === ROLES.customer;
  const customerInfo = advertisement.lead?.customer;
  const customerPhone = String(customerInfo?.tel ?? "").trim();

  return (
    <Box component="section" aria-label={t("advertisements.information")}>
      <Section
        title={t("advertisements.information")}
        icon={<CampaignOutlinedIcon color="primary" />}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          <InfoItem label={"Кто создал"} value={source} />

          <InfoItem
            label={t("ui.publication_date")}
            value={formatAdvertisementDate(advertisement.created_at)}
          />
          <InfoItem
            label={t("advertisements.expires_at")}
            value={formatAdvertisementDate(advertisement.expired_at)}
          />
          <InfoItem
            label={t("ui.closing_date")}
            value={formatAdvertisementDate(advertisement.closed_at)}
          />

          {isCustomerCreated && (
            <InfoItem
              label={"Номер заказчика"}
              value={
                customerPhone ? (
                  <ContactValue value={customerPhone} type="phone" />
                ) : null
              }
            />
          )}
        </Box>
      </Section>
    </Box>
  );
};

export default AdvertisementInformation;
