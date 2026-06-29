import { useNavigate, useParams } from "react-router-dom";
import RootLayout from "../../../components/layout/root-layout";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
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

const TenderForwardersItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);

  const currentTender = useTendersStore((state) => state.currentTender);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const deleteTender = useTendersStore((state) => state.deleteTender);
  const startTender = useTendersStore((state) => state.startTender);
  const cancelTender = useTendersStore((state) => state.cancelTender);

  const defaultValues = useTenderDefaultValues(currentTender);

  const isCanceled = currentTender?.status === STATUS.cancelled;
  const isNew = currentTender?.status === STATUS.new;

  const from = {
    lat: currentTender?.lead?.from_location.lat,
    lon: currentTender?.lead?.from_location.lon,
  };
  const to = {
    lat: currentTender?.lead?.to_location.lat,
    lon: currentTender?.lead?.to_location.lon,
  };

  const handleDeleteTender = () => {
    deleteTender(id);
    navigate("/tender-forwarders");
  };

  const handleStartTender = async () => {
    await startTender(id);
    await getTenderDetails(id);
  };

  const handleCancelTender = async () => {
    await cancelTender(id);
    await getTenderDetails(id);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  useEffect(() => {
    getTenderDetails(id);
  }, [id]);

  if (!currentTender) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <TenderDetailsHeading
        tender={currentTender}
        handleOpenForm={handleOpenForm}
      />

      <LeadMap from={from} to={to} id={currentTender?.lead?.id} />

      <TenderForm
        isEdit
        openForm={openForm}
        handleCloseForm={handleCloseForm}
        defaultValues={defaultValues}
      />

      <TransportationInfo tender={currentTender} />

      <TenderInfo tender={currentTender} />

      <LeadDocuments tender={currentTender} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: {
            xs: 0,
            sm: 3,
          },
        }}
      >
        <TenderParticipants tender={currentTender} />

        <TenderBets tender={currentTender} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          gap: "10px",
          p: {
            xs: 0,
            sm: 4,
          },
        }}
      >
        {isNew && (
          <Button
            variant="contained"
            color="success"
            onClick={handleStartTender}
          >
            Запустить тендер
          </Button>
        )}
        {!isCanceled && (
          <>
            <Button
              onClick={handleCancelTender}
              variant="outlined"
              color="warning"
            >
              Отменить тендер
            </Button>
          </>
        )}
        <Button onClick={handleDeleteTender} variant="outlined" color="error">
          Удалить тендер
        </Button>
      </Box>
    </RootLayout>
  );
};

export default TenderForwardersItem;
