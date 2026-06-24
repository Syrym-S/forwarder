import React, { useEffect } from "react";
import RootLayout from "../../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import { useFactoringStore } from "../../../app/store/factoring/factoring-store";
import Loader from "../../../components/layout/loader";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import FactoringDetailsHeading from "../../../components/factoring/factoring-details-heading";
import LeadMap from "../../../components/leads/lead-map";
import { Container } from "@mui/material";
import FactoringFinancialInfo from "../../../components/factoring/factoring-financial-info";
import FactoringCustomerInfo from "../../../components/factoring/factoring-customer-info";
import TransportationInfo from "../../../components/tenders/transportation-info";
import FactoringTransportationInfo from "../../../components/factoring/factoring-transportation-info";
import FactoringCargoInfo from "../../../components/factoring/factoring-cargo-info";

const FactoringItem = () => {
  const { id } = useParams();

  const currentLead = useLeadsStore((state) => state.currentLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const factoringDetails = useFactoringStore((state) => state.factoringDetails);
  const getFactoringDetails = useFactoringStore(
    (state) => state.getFactoringDetails,
  );

  const from = {
    lat: currentLead?.from_location.lat,
    lon: currentLead?.from_location.lon,
  };
  const to = {
    lat: currentLead?.to_location.lat,
    lon: currentLead?.to_location.lon,
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
    }
  }, [factoringDetails]);

  if (!factoringDetails || !currentLead) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <FactoringDetailsHeading factoring={factoringDetails} />

      <LeadMap from={from} to={to} id={currentLead?.id} />

      <Container maxWidth="lg" sx={{ py: 1 }}>
        <FactoringTransportationInfo lead={currentLead} />

        <FactoringCargoInfo leadData={currentLead} />

        <FactoringFinancialInfo factoring={factoringDetails} />

        <FactoringCustomerInfo customer={factoringDetails?.customer} />
      </Container>
    </RootLayout>
  );
};

export default FactoringItem;
