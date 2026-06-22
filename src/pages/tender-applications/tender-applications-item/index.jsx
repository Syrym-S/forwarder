import { useParams } from "react-router-dom";
import RootLayout from "../../../components/layout/root-layout";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LeadMap from "../../../components/leads/lead-map";
import Section from "../../../shared/ui/section";
import InfoField from "../../../shared/ui/info-field";
import Loader from "../../../components/layout/loader";
import TenderForm from "../../../features/tenders/tender-form";
import RenderStatus from "../../../shared/ui/render-status";
import TenderParticipants from "../../../components/tenders/tender-participants";
import LeadDocuments from "../../../components/tenders/lead-documents";
import TenderInfo from "../../../components/tenders/tender-info";
import TransportationInfo from "../../../components/tenders/transportation-info";
import TenderDetailsHeading from "../../../components/tenders/tender-details-heading";
import { LeadDocumentCard } from "../../../components/leads/documents/LeadDocumentCard";
import { useTenderDefaultValues } from "../../../shared/hooks/tender/use-tender-default-values";
import { STATUS } from "../../../shared/const/tenders";
import TenderBets from "../../../components/tenders/tender-bets";
import MakeBetForm from "../../../features/tenders/make-bet-form";
import MakeBetBlock from "../../../components/tenders/make-bet-block";
import CancelledBets from "../../../components/tenders/cancelled-bets";

const TenderApplicationsItem = () => {
  const { id } = useParams();

  const [openForm, setOpenForm] = useState(false);
  const [showBetField, setShowBetField] = useState();

  const customerCurrentTender = useTendersStore(
    (state) => state.customerCurrentTender,
  );

  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );

  const defaultValues = useTenderDefaultValues(customerCurrentTender);

  const from = {
    lat: customerCurrentTender?.lead?.from_location.lat,
    lon: customerCurrentTender?.lead?.from_location.lon,
  };
  const to = {
    lat: customerCurrentTender?.lead?.to_location.lat,
    lon: customerCurrentTender?.lead?.to_location.lon,
  };

  const handleHideBetField = () => {
    setShowBetField(false);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  console.log(customerCurrentTender?.lead?.id);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    getCustomerTenderDetails(id);
  }, [id]);

  if (!customerCurrentTender) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <TenderDetailsHeading
        tender={customerCurrentTender}
        handleOpenForm={handleOpenForm}
        isCustomerTender
      />

      <LeadMap from={from} to={to} id={customerCurrentTender?.lead?.id} />

      <TenderForm
        isEdit
        openForm={openForm}
        handleCloseForm={handleCloseForm}
        defaultValues={defaultValues}
      />

      <Container maxWidth="lg" sx={{ py: 1 }}>
        <TransportationInfo tender={customerCurrentTender} />

        <TenderInfo tender={customerCurrentTender} />

        <LeadDocuments tender={customerCurrentTender} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
            gap: 5,
          }}
        >
          {showBetField ? (
            <MakeBetForm
              tender={customerCurrentTender}
              handleHideBetField={handleHideBetField}
            />
          ) : (
            <MakeBetBlock
              tender={customerCurrentTender}
              setShowBetField={setShowBetField}
            />
          )}

          <CancelledBets bets={customerCurrentTender?.bets} />
        </Box>
      </Container>
    </RootLayout>
  );
};

export default TenderApplicationsItem;
