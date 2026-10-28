import { Box } from "@mui/material";
import { useLoaderData, useParams } from "react-router-dom";
import LeadCustomerInfo from "../../../src/components/leads/lead-item/lead-customer-info";
import LeadRouteInfo from "../../../src/components/leads/lead-item/lead-route-info";
import LeadMap from "../../../src/components/leads/lead-map";
import Header from "./ui/header";
import LeadCargoInfo from "../../../src/components/leads/lead-item/lead-cargo-info";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Section from "../../../src/shared/ui/section";
import LeadDriverInfo from "../../../src/components/leads/lead-item/lead-driver-info";
import LeadTransportationInfo from "../../../src/components/leads/lead-item/lead-transportation-info";

const SharedLeadApp = () => {
  const leadData = useLoaderData();
  const { leadId } = useParams();

  const cargosCount = leadData?.cargos?.length;

  const waypoints = leadData?.waypoints?.map((waypoint) => {
    return {
      lat: waypoint.lat,
      lon: waypoint.lon,
    };
  });

  const from = {
    lat: leadData?.from_location.lat,
    lon: leadData?.from_location.lon,
  };
  const to = {
    lat: leadData?.to_location.lat,
    lon: leadData?.to_location.lon,
  };

  return (
    <>
      <Header />

      <Box
        sx={{
          px: 3,
          my: 4,
          width: {
            xs: "90%",
            md: "60%",
          },
          mx: "auto",
          mb: 5,
          height: "100vh",
        }}
      >
        <Box
          sx={{
            boxShadow: 1,
            borderRadius: 2,
            overflow: "hidden",
            my: 3,
          }}
        >
          <LeadMap waypoints={waypoints} from={from} to={to} id={leadId} leadData={leadData} />
        </Box>

        <LeadRouteInfo leadData={leadData} />

        <LeadTransportationInfo leadData={leadData} hidePrices />

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
            {leadData?.cargos?.map((cargo, index) => (
              <LeadCargoInfo
                key={cargo.id || index}
                cargosCount={cargosCount}
                cargo={cargo}
                lead={leadData}
                index={index}
                isLeadsPage
                hidePrices
              />
            ))}
          </Box>
        </Section>

        <LeadCustomerInfo leadData={leadData} />

        <LeadDriverInfo leadData={leadData} hideRatingAction />
      </Box>
    </>
  );
};

export default SharedLeadApp;
