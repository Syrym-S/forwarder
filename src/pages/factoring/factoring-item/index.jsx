import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../../shared/helpers/money-spacing";
import RootLayout from "../../../components/layout/root-layout";
import FactoringDetailsHeading from "../../../components/factoring/factoring-details-heading";
import LeadMap from "../../../components/leads/lead-map";
import FactoringFinancialInfo from "../../../components/factoring/factoring-financial-info";
import Section from "../../../components/leads/lead-item/lead-detail-section";
import ProfileDataTable from "../../../components/factoring/profile-data-table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import FactoringVerifications from "../../../components/factoring/factoring-verifications";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ConfirmModal from "../../../components/factoring/confirm-modal";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useEffect, useState } from "react";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { Alert, Box, Chip, Typography } from "@mui/material";
import PrimaryButton from "../../../shared/ui/button/primary-button";
import { useProfileStore } from "../../../app/store/profile/profile-store";
import { STATUS } from "../../../shared/const/tenders";
import { useParams } from "react-router-dom";
import { useFactoringStore } from "../../../app/store/factoring/factoring-store";
import LeadRouteInfo from "../../../components/leads/lead-item/lead-route-info";
import InfoItem from "../../../shared/ui/info-item";
import CargoCard from "../../../components/leads/lead-item/lead-cargo-info";
import CustomerDataTable from "../../../components/factoring/customer-data-table";
import LeadTransportationInfo from "../../../components/leads/lead-item/lead-transportation-info";

const FactoringItem = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const features = window.APP_DATA?.features || {};
  const isMustSignDocument =
    features.sign_provider_aitu || features.sign_provider_ncanode;

  const [openConfirmModal, setOpenConfirmModal] = useState(null);
  const [regenerateFeedback, setRegenerateFeedback] = useState(null);

  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const factoringDetails = useFactoringStore((state) => state.factoringDetails);
  const acceptFactoring = useFactoringStore((state) => state.acceptFactoring);
  const regenerateFactoring = useFactoringStore(
    (state) => state.regenerateFactoring,
  );
  const isRegenerateLoading = useFactoringStore(
    (state) => state.isRegenerateLoading,
  );
  const getFactoringDetails = useFactoringStore(
    (state) => state.getFactoringDetails,
  );
  const isConfirmLoading = useFactoringStore((state) => state.isConfirmLoading);
  const isLoading = useFactoringStore((state) => state.isLoading);
  const profileData = useProfileStore((state) => state.profileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);
  const approvePaiment = useFactoringStore((state) => state.approvePaiment);

  const from = {
    lat: currentLead?.from_location.lat,
    lon: currentLead?.from_location.lon,
  };
  const to = {
    lat: currentLead?.to_location.lat,
    lon: currentLead?.to_location.lon,
  };

  const waypoints = currentLead?.waypoints?.map((waypoint) => {
    return {
      lat: waypoint.lat,
      lon: waypoint.lon,
    };
  });

  const handleAcceptFactoring = async () => {
    const response = await acceptFactoring(id);

    const link = response.sign_url;

    await getFactoringDetails(id);

    window.open(link, "_blank");
  };

  const handleRegenerateFactoring = async () => {
    setRegenerateFeedback(null);

    try {
      await regenerateFactoring(id);
    } catch (error) {
      setRegenerateFeedback({
        severity: "error",
        message:
          error.response?.data?.message ||
          t("ui.document_regeneration_failed_retry"),
      });
      return;
    }

    try {
      await getFactoringDetails(id);
      setRegenerateFeedback({
        severity: "success",
        message: t("ui.document_regenerated"),
      });
    } catch {
      setRegenerateFeedback({
        severity: "warning",
        message:
          t("ui.document_regenerated_refresh_failed"),
      });
    }
  };

  const handleOpenModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseModal = () => {
    setOpenConfirmModal(false);
  };

  const handleApprovePaiment = async () => {
    await approvePaiment(id);
    await getFactoringDetails(id);
    handleCloseModal();
  };

  const canBeApproved =
    !factoringDetails?.await_paid_ff &&
    factoringDetails?.status === STATUS.await_paid;

  useEffect(() => {
    const getDetails = async () => {
      await getFactoringDetails(id);
    };

    getDetails();
  }, []);

  useEffect(() => {
    if (factoringDetails) {
      getLeadItem(factoringDetails?.lead_id);
      getProfileData();
    }
  }, [factoringDetails]);

  if (!factoringDetails || !currentLead || !profileData)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box
        sx={{
          maxWidth: 1440,
          width: "100%",
          minWidth: 0,
          mx: "auto",
          "& .MuiTableCell-root": { overflowWrap: "anywhere" },
          "& .MuiTable-root": { tableLayout: "fixed" },
        }}
      >
        <FactoringDetailsHeading factoring={factoringDetails} />

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
            my: 2,
          }}
        >
          <LeadMap
            from={from}
            waypoints={waypoints}
            to={to}
            id={currentLead?.id}
          />
        </Box>

        {/* {(factoringDetails?.verified_forwarder || isMustSignDocument) && ( */}
        <Section
          title={t("ui.confirm_factoring")}
          icon={<DescriptionOutlinedIcon color="primary" />}
        >
          {factoringDetails?.verified_forwarder ? (
            <Alert severity="success" sx={{ borderRadius: 2 }}>{t("ui.contract_signed_success")}</Alert>
          ) : (
            <>
              <Typography sx={{ mb: 2, color: "text.secondary", fontSize: 14 }}>{t("ui.factoring_contract_signing_hint")}</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } },
                }}
              >
                <PrimaryButton
                  size="medium"
                  isLoading={isConfirmLoading}
                  disabled={
                    isConfirmLoading || isLoading || isRegenerateLoading
                  }
                  onClick={handleAcceptFactoring}
                  text={
                    isConfirmLoading ? t("ui.confirmation_in_progress_3") : t("ui.confirm")
                  }
                />
                <PrimaryButton
                  variant="outlined"
                  size="medium"
                  isLoading={isRegenerateLoading}
                  disabled={isConfirmLoading || isLoading}
                  onClick={handleRegenerateFactoring}
                  text={
                    isRegenerateLoading
                      ? t("ui.regenerating_document")
                      : t("ui.regenerate_document")
                  }
                />
              </Box>
              {regenerateFeedback && (
                <Alert severity={regenerateFeedback.severity} sx={{ mt: 2 }}>
                  {regenerateFeedback.message}
                </Alert>
              )}
            </>
          )}
        </Section>
        {/* )} */}

        {/* <ConfirmModal /> */}

        <LeadRouteInfo leadData={currentLead} />

        <LeadTransportationInfo leadData={currentLead} />

        <Section
          title={t("ui.payment_confirmation")}
          icon={<RequestQuoteOutlinedIcon color="primary" />}
        >
          {canBeApproved && (
            <PrimaryButton
              variant="outlined"
              color="primary"
              onClick={handleOpenModal}
              sx={{
                my: 1,
              }}
              text={t("ui.confirm_forwarder_payment")}
            />
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 1.5,
            }}
          >
            <InfoItem
              label={t("ui.forwarder_confirms_factor_payment")}
              value={
                <Chip
                  size="small"
                  color={factoringDetails.await_paid_ff ? "success" : "default"}
                  label={
                    factoringDetails.await_paid_ff
                      ? t("ui.confirmed")
                      : t("ui.not_confirmed")
                  }
                />
              }
            />
            <InfoItem
              label={t("ui.factor_confirms_customer_payment")}
              value={
                <Chip
                  size="small"
                  color={factoringDetails.await_paid_cf ? "success" : "default"}
                  label={
                    factoringDetails.await_paid_cf
                      ? t("ui.confirmed")
                      : t("ui.not_confirmed")
                  }
                />
              }
            />
          </Box>

          {openConfirmModal && (
            <ConfirmModal
              open={openConfirmModal}
              onClose={handleCloseModal}
              text={t("ui.confirm_factoring_amount", { value1: moneySpacingFormat(currentLead?.price), value2: currentLead?.currency })}
              onConfirm={handleApprovePaiment}
            />
          )}
        </Section>

        <Section
          title={t("ui.cargo")}
          icon={<LocalShippingOutlinedIcon color="primary" />}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 2,
            }}
          >
            {currentLead?.cargos?.map((cargo, index) => (
              <CargoCard key={cargo.id ?? index} cargo={cargo} index={index} />
            ))}
          </Box>
        </Section>

        <FactoringFinancialInfo factoring={factoringDetails} />

        {/* <FactoringCustomerInfo
          customer={factoringDetails?.customer}
          verified_customer={factoringDetails?.verified_customer}
        /> */}

        <FactoringVerifications factoring={factoringDetails} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            columnGap: 2,
            alignItems: "start",
          }}
        >
          <Section
            icon={<AccountCircleOutlinedIcon color="primary" />}
            title={t("ui.my_details")}
          >
            <ProfileDataTable />
          </Section>

          <Section
            icon={<RememberMeOutlinedIcon color="primary" />}
            title={t("ui.factor_details")}
          >
            <FactorDataTable factor={factoringDetails?.factor} />
          </Section>

          <Section
            icon={<RememberMeOutlinedIcon color="primary" />}
            title={t("ui.customer_details_3")}
          >
            <CustomerDataTable
              customer={factoringDetails?.customer}
              verified_customer={factoringDetails?.verified_customer}
            />
          </Section>
        </Box>
      </Box>
    </RootLayout>
  );
};

export default FactoringItem;
