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

const FactoringItem = () => {
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
          "Не удалось перегенерировать документ. Попробуйте ещё раз.",
      });
      return;
    }

    try {
      await getFactoringDetails(id);
      setRegenerateFeedback({
        severity: "success",
        message: "Документ перегенерирован. Можно перейти к подписанию.",
      });
    } catch {
      setRegenerateFeedback({
        severity: "warning",
        message:
          "Документ перегенерирован, но не удалось обновить данные. Обновите страницу.",
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

        {(factoringDetails?.verified_forwarder || isMustSignDocument) && (
          <Section
            title="Подтвердить факторинг"
            icon={<DescriptionOutlinedIcon color="primary" />}
          >
            {factoringDetails?.verified_forwarder ? (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                Вы подписали договор!
              </Alert>
            ) : (
              <>
                <Typography sx={{ mb: 2, color: "text.secondary", fontSize: 14 }}>
                  Подпишите договор для подтверждения факторинга. При необходимости
                  вы можете перегенерировать документ перед подписанием.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5,
                  "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } },
                }}>
                  <PrimaryButton
                    size="medium"
                    isLoading={isConfirmLoading}
                    disabled={isConfirmLoading || isLoading || isRegenerateLoading}
                    onClick={handleAcceptFactoring}
                    text={isConfirmLoading ? "Идёт подтверждение..." : "Подтвердить"}
                  />
                  <PrimaryButton
                    variant="outlined"
                    size="medium"
                    isLoading={isRegenerateLoading}
                    disabled={isConfirmLoading || isLoading}
                    onClick={handleRegenerateFactoring}
                    text={
                      isRegenerateLoading
                        ? "Перегенерация..."
                        : "Перегенерировать документ"
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
        )}

        {/* <ConfirmModal /> */}

        <LeadRouteInfo leadData={currentLead} />

        <Section
          title={`Подтверждение оплаты`}
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
              text="Подтвердить оплату со стороны экспедитора"
            />
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            <InfoItem
              label={"Подтверждение оплаты Экспедитором от Фактора"}
              value={
                <Chip
                  size="small"
                  color={factoringDetails.await_paid_ff ? "success" : "default"}
                  label={
                    factoringDetails.await_paid_ff
                      ? "Подтверждено"
                      : "Не подтверждено"
                  }
                />
              }
            />
            <InfoItem
              label={"Подтверждение оплаты Фактором от Заказчика"}
              value={
                <Chip
                  size="small"
                  color={factoringDetails.await_paid_cf ? "success" : "default"}
                  label={
                    factoringDetails.await_paid_cf
                      ? "Подтверждено"
                      : "Не подтверждено"
                  }
                />
              }
            />
          </Box>

          {openConfirmModal && (
            <ConfirmModal
              open={openConfirmModal}
              onClose={handleCloseModal}
              text={`Вы действительно хотите подтвердить факторинг на сумму ${currentLead?.price} ${currentLead?.currency}`}
              onConfirm={handleApprovePaiment}
            />
          )}
        </Section>

        <Section
          title={`Груз`}
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
            title={"Мои данные"}
          >
            <ProfileDataTable />
          </Section>

          <Section
            icon={<RememberMeOutlinedIcon color="primary" />}
            title={"Данные Фактора"}
          >
            <FactorDataTable factor={factoringDetails?.factor} />
          </Section>

          <Section
            icon={<RememberMeOutlinedIcon color="primary" />}
            title={"Данные Заказчика"}
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
