import RootLayout from "../../../components/layout/root-layout";
import FactoringDetailsHeading from "../../../components/factoring/factoring-details-heading";
import LeadMap from "../../../components/leads/lead-map";
import FactoringFinancialInfo from "../../../components/factoring/factoring-financial-info";
import FactoringCustomerInfo from "../../../components/factoring/factoring-customer-info";
import FactoringTransportationInfo from "../../../components/factoring/factoring-transportation-info";
import FactoringCargoInfo from "../../../components/factoring/factoring-cargo-info";
import Section from "../../../shared/ui/section";
import ProfileDataTable from "../../../components/factoring/profile-data-table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import FactoringVerifications from "../../../components/factoring/factoring-verifications";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ConfirmModal from "../../../components/factoring/confirm-modal";
import InfoField from "../../../shared/ui/info-field";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { useEffect, useState } from "react";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { Box, Button, Chip } from "@mui/material";
import { useProfileStore } from "../../../app/store/profile/profile-store";
import { STATUS } from "../../../shared/const/tenders";
import { useParams } from "react-router-dom";
import { useFactoringStore } from "../../../app/store/factoring/factoring-store";

const FactoringItem = () => {
  const { id } = useParams();

  const [openConfirmModal, setOpenConfirmModal] = useState(null);

  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const factoringDetails = useFactoringStore((state) => state.factoringDetails);
  const acceptFactoring = useFactoringStore((state) => state.acceptFactoring);
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
      <FactoringDetailsHeading factoring={factoringDetails} />
      <Box
        sx={{
          boxShadow: 1,
          borderRadius: 2,
          overflow: "hidden",
          my: 3,
        }}
      >
        <LeadMap
          from={from}
          waypoints={waypoints}
          to={to}
          id={currentLead?.id}
        />
      </Box>

      <Section
        title="Подпись документа"
        icon={<DescriptionOutlinedIcon color="primary" />}
      >
        {!factoringDetails?.verified_forwarder && (
          <Button
            variant="outlined"
            disabled={isConfirmLoading || isLoading}
            onClick={handleAcceptFactoring}
          >
            {isConfirmLoading || isLoading
              ? "...Идет подтверждение"
              : "Подтвердить"}
          </Button>
        )}
      </Section>

      <FactoringTransportationInfo lead={currentLead} />

      <Section
        title={`Подтверждении оплаты`}
        icon={<RequestQuoteOutlinedIcon color="primary" />}
      >
        {canBeApproved && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenModal}
            sx={{
              my: 1,
            }}
          >
            Подтвердить оплату cо стороны экспедитора
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <InfoField
            label={"Со стороны экспедитора"}
            value={
              <Chip
                color={factoringDetails.await_paid_ff ? "success" : ""}
                label={
                  factoringDetails.await_paid_ff
                    ? "Подтверждено"
                    : "Не подтверждено"
                }
              />
            }
          />
          <InfoField
            label={"Со стороны фатора"}
            value={
              <Chip
                color={factoringDetails.await_paid_cf ? "success" : ""}
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
            text={`Вы дейтсвительно хотите подтвердить факторинг на сумму ${currentLead?.price} ${currentLead?.currency}`}
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
          {currentLead?.cargos?.map((cargo) => (
            <FactoringCargoInfo cargo={cargo} />
          ))}
        </Box>
      </Section>

      <FactoringFinancialInfo factoring={factoringDetails} />

      <FactoringCustomerInfo
        customer={factoringDetails?.customer}
        verified_customer={factoringDetails?.verified_customer}
      />
      <FactoringVerifications factoring={factoringDetails} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: {
            xs: 1,
            sm: 3,
          },
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
      </Box>
    </RootLayout>
  );
};

export default FactoringItem;
