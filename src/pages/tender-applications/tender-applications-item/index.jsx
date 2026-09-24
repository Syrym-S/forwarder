import RootLayout from "../../../components/layout/root-layout";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LeadMap from "../../../components/leads/lead-map";
import Section from "../../../components/tenders/tender-section";
import LeadDocuments from "../../../components/tenders/lead-documents";
import TenderInfo from "../../../components/tenders/tender-info";
import TenderDetailsHeading from "../../../components/tenders/tender-details-heading";
import MakeBetForm from "../../../features/tenders/make-bet-form";
import MakeBetBlock from "../../../components/tenders/make-bet-block";
import CancelledBets from "../../../components/tenders/cancelled-bets";
import PageLoader from "../../../shared/ui/loaders/page-loader";
import LeadCargoInfo from "../../../components/leads/lead-item/lead-cargo-info";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { Box } from "@mui/material";
import { STATUS } from "../../../shared/const/tenders";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";
import LeadRouteInfo from "../../../components/leads/lead-item/lead-route-info";

const TenderApplicationsItem = () => {
  const { id } = useParams();

  const [showBetField, setShowBetField] = useState();

  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
  const customerCurrentTender = useTendersStore(
    (state) => state.customerCurrentTender,
  );
  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );

  const from = {
    lat: customerCurrentTender?.lead?.from_location.lat,
    lon: customerCurrentTender?.lead?.from_location.lon,
  };
  const to = {
    lat: customerCurrentTender?.lead?.to_location.lat,
    lon: customerCurrentTender?.lead?.to_location.lon,
  };

  const waypoints = customerCurrentTender?.lead?.waypoints?.map((waypoint) => {
    return {
      lat: waypoint.lat,
      lon: waypoint.lon,
    };
  });

  const cargosInfo = customerCurrentTender?.lead?.cargos;
  const isTenderActive = customerCurrentTender?.status === STATUS.active;

  const handleHideBetField = () => {
    setShowBetField(false);
  };

  const { notification_type } = parserNotificationType(newNotification?.type);

  useEffect(() => {
    getCustomerTenderDetails(id);
  }, [id]);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.tender) {
      getCustomerTenderDetails(id);
    }
  }, [newNotification]);

  console.log("customerCurrentTender", customerCurrentTender);

  if (!customerCurrentTender)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout withoutDataCheck>
      <Box sx={{ width: "100%", maxWidth: 1440, mx: "auto", minWidth: 0 }}>
      <TenderDetailsHeading tender={customerCurrentTender} isCustomerTender />

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          my: 3,
        }}
      >
        <LeadMap
          from={from}
          waypoints={waypoints}
          to={to}
          id={customerCurrentTender?.lead?.id}
        />
      </Box>

      <LeadRouteInfo leadData={customerCurrentTender.lead} />

      <TenderInfo tender={customerCurrentTender} />

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

      <LeadDocuments tender={customerCurrentTender} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gridTemplateRows: "1fr",
          gap: {
            xs: 0,
            lg: 2,
          },
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

        {isTenderActive && <CancelledBets bets={customerCurrentTender?.bets} />}
      </Box>
      </Box>
    </RootLayout>
  );
};

export default TenderApplicationsItem;
