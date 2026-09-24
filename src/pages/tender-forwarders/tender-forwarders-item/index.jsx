import RootLayout from "../../../components/layout/root-layout";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LeadMap from "../../../components/leads/lead-map";
import Section from "../../../components/tenders/tender-section";
import TenderForm from "../../../features/tenders/tender-form";
import TenderParticipants from "../../../components/tenders/tender-participants";
import LeadDocuments from "../../../components/tenders/lead-documents";
import TenderInfo from "../../../components/tenders/tender-info";
import TenderDetailsHeading from "../../../components/tenders/tender-details-heading";
import TenderBets from "../../../components/tenders/tender-bets";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import LeadCargoInfo from "../../../components/leads/lead-item/lead-cargo-info";
import LeadRouteInfo from "../../../components/leads/lead-item/lead-route-info";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { Box } from "@mui/material";
import { useTenderDefaultValues } from "../../../shared/hooks/tender/use-tender-default-values";
import { STATUS } from "../../../shared/const/tenders";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import PrimaryButton from "../../../shared/ui/button/primary-button";

const TenderForwardersItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openForm, setOpenForm] = useState(false);

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const currentTender = useTendersStore((state) => state.currentTender);
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

  if (!currentTender)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto", minWidth: 0 }}>
      <TenderDetailsHeading
        tender={currentTender}
        handleOpenForm={handleOpenForm}
      />

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

      <LeadRouteInfo leadData={currentTender?.lead} />

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
          {cargosInfo?.map((cargo, index) => (
            <LeadCargoInfo key={cargo.id || index} cargo={cargo} index={index} />
          ))}
        </Box>
      </Section>

      <LeadDocuments tender={currentTender} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: {
            xs: 0,
            lg: 2,
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
          flexWrap: "wrap",
          gap: "10px",
          p: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        {isNew && (
          <PrimaryButton
            variant="contained"
            color="success"
            onClick={handleStartTender}
            text="Запустить аукцион"
          />
        )}
        {/* {isNew && (
          <Button
            variant="contained"
            color="success"
            onClick={handleStartTender}
          >
            Запустить аукцион
          </Button>
        )} */}
        {!isCanceled && !isClosed && (
          <PrimaryButton
            onClick={handleCancelTender}
            variant="outlined"
            text="Отменить аукцион"
            color="warning"
          />
        )}

        {!hasWinner && (
          <PrimaryButton
            variant="outlined"
            onClick={handleDeleteTender}
            color="error"
            text="Удалить аукцион"
          />
        )}
      </Box>
      </Box>
    </RootLayout>
  );
};

export default TenderForwardersItem;
