import React, { useEffect } from "react";
import RootLayout from "../../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import { useFactoringStore } from "../../../app/store/factoring/factoring-store";
import Loader from "../../../components/layout/loader";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import FactoringDetailsHeading from "../../../components/factoring/factoring-details-heading";
import LeadMap from "../../../components/leads/lead-map";
import { Box, Button, Container, Stack } from "@mui/material";
import FactoringFinancialInfo from "../../../components/factoring/factoring-financial-info";
import FactoringCustomerInfo from "../../../components/factoring/factoring-customer-info";
import TransportationInfo from "../../../components/tenders/transportation-info";
import FactoringTransportationInfo from "../../../components/factoring/factoring-transportation-info";
import FactoringCargoInfo from "../../../components/factoring/factoring-cargo-info";
import Section from "../../../shared/ui/section";
import { useProfileStore } from "../../../app/store/profile/profile-store";
import InfoField from "../../../shared/ui/info-field";
import ProfileDataTable from "../../../components/factoring/profile-data-table";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FactorDataTable from "../../../components/factoring/factor-data-table";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";

const FactoringItem = () => {
  const { id } = useParams();

  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const factoringDetails = useFactoringStore((state) => state.factoringDetails);
  const acceptFactoring = useFactoringStore((state) => state.acceptFactoring);
  const getFactoringDetails = useFactoringStore(
    (state) => state.getFactoringDetails,
  );
  const profileData = useProfileStore((state) => state.profileData);
  const getProfileData = useProfileStore((state) => state.getProfileData);

  const from = {
    lat: currentLead?.from_location.lat,
    lon: currentLead?.from_location.lon,
  };
  const to = {
    lat: currentLead?.to_location.lat,
    lon: currentLead?.to_location.lon,
  };

  const handleAcceptFactoring = async () => {
    await acceptFactoring(id);
    await getFactoringDetails(id);
  };

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

  if (!factoringDetails || !currentLead || !profileData) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <FactoringDetailsHeading factoring={factoringDetails} />

      <LeadMap from={from} to={to} id={currentLead?.id} />

      <Container maxWidth="lg" sx={{ py: 1 }}>
        <FactoringTransportationInfo lead={currentLead} />

        <FactoringCargoInfo leadData={currentLead} />

        <FactoringFinancialInfo factoring={factoringDetails} />

        <FactoringCustomerInfo
          customer={factoringDetails?.customer}
          verified_customer={factoringDetails?.verified_customer}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
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

        {!factoringDetails?.verified_forwarder && (
          <Button onClick={handleAcceptFactoring}>Подтвердить</Button>
        )}
      </Container>
    </RootLayout>
  );
};

export default FactoringItem;
