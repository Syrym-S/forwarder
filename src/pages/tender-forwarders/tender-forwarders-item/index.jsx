import { useNavigate, useParams } from "react-router-dom";
import RootLayout from "../../../components/layout/root-layout";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
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
import PageLoader from "../../../shared/ui/loaders/page-loader";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import LeadCargoInfo from "../../../components/leads/lead-item/lead-cargo-info";

const TenderForwardersItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const currentTender = useTendersStore((state) => state.currentTender);
  const isLoadingCurrentTenderLoading = useTendersStore(
    (state) => state.isLoadingCurrentTenderLoading,
  );
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const deleteTender = useTendersStore((state) => state.deleteTender);
  const startTender = useTendersStore((state) => state.startTender);
  const cancelTender = useTendersStore((state) => state.cancelTender);

  const defaultValues = useTenderDefaultValues(currentTender);

  const isClosed = currentTender?.status === STATUS.closed;
  const isCanceled = currentTender?.status === STATUS.cancelled;
  const isNew = currentTender?.status === STATUS.new;

  const hasWinner = !!currentTender?.bets?.find(
    (bet) => bet.status === "winning",
  );

  const { action } = parserNotificationType(newNotification?.type || "");

  const cargosInfo = currentTender?.lead?.cargos;

  const from = {
    lat: currentTender?.lead?.from_location.lat,
    lon: currentTender?.lead?.from_location.lon,
  };
  const to = {
    lat: currentTender?.lead?.to_location.lat,
    lon: currentTender?.lead?.to_location.lon,
  };

  const waypoints = currentTender?.lead?.waypoints?.map((waypoint) => {
    return {
      lat: waypoint.lat,
      lon: waypoint.lon,
    };
  });

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
    if (
      action === "bet_added_by_driver" ||
      action === "bet_cancelled_by_driver"
    ) {
      getTenderDetails(id);
    }
  }, [newNotification]);

  useEffect(() => {
    getTenderDetails(id);
  }, []);

  if (!currentTender || isLoadingCurrentTenderLoading)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <TenderDetailsHeading
        tender={currentTender}
        handleOpenForm={handleOpenForm}
      />

      <Box
        sx={{
          boxShadow: 1,
          borderRadius: 2,
          overflow: "hidden",
          my: 2,
        }}
      >
        <LeadMap
          from={from}
          waypoints={waypoints}
          to={to}
          id={currentTender?.lead?.id}
        />
      </Box>

      {openForm && (
        <TenderForm
          isEdit
          openForm={openForm}
          handleCloseForm={handleCloseForm}
          defaultValues={defaultValues}
        />
      )}

      <TransportationInfo tender={currentTender} />

      <TenderInfo tender={currentTender} />

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
          {cargosInfo?.map((cargo) => (
            <LeadCargoInfo cargo={cargo} />
          ))}
        </Box>
      </Section>

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
        {!isCanceled ||
          (!isClosed && (
            <>
              <Button
                onClick={handleCancelTender}
                variant="outlined"
                color="warning"
              >
                Отменить тендер
              </Button>
            </>
          ))}
        {!hasWinner && (
          <Button onClick={handleDeleteTender} variant="outlined" color="error">
            Удалить тендер
          </Button>
        )}
      </Box>
    </RootLayout>
  );
};

export default TenderForwardersItem;
