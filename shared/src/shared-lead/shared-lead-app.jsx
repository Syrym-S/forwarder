import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getSharedLeadApi } from "./api/index.api";
import LeadCustomerInfo from "../../../src/components/leads/lead-item/lead-customer-info";
import LeadRouteInfo from "../../../src/components/leads/lead-item/lead-route-info";
import LeadMap from "../../../src/components/leads/lead-map";
import Header from "./ui/header";
import LeadCargoInfo from "../../../src/components/leads/lead-item/lead-cargo-info";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Section from "../../../src/shared/ui/section";
import LeadDriverInfo from "../../../src/components/leads/lead-item/lead-driver-info";

const SharedLeadApp = () => {
  const [leadData, setLeadData] = useState(null);

  const path = window.location.pathname;

  const parts = path.split("/").filter(Boolean);

  const sharedIndex = parts.indexOf("shared");

  const leadId = parts[sharedIndex + 1];
  const token = parts[sharedIndex + 2];

  const cargosCount = leadData?.cargos?.length;

  const getSharedLead = async () => {
    try {
      const response = await getSharedLeadApi(leadId, token);

      setLeadData(response.data.data);
    } catch (e) {
      console.log(e);
    }
  };

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

  useEffect(() => {
    const load = async () => {
      await getSharedLead();
    };

    load();
  }, []);

  if (!leadData) return <CircularProgress />;

  return (
    <>
      <Header />

      <Box
        sx={{
          my: 4,
          width: "60%",
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
          <LeadMap waypoints={waypoints} from={from} to={to} id={leadId} />
        </Box>

        <LeadRouteInfo leadData={leadData} />

        <LeadCustomerInfo leadData={leadData} />

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
                cargosCount={cargosCount}
                cargo={cargo}
                lead={leadData}
                index={index}
                isLeadsPage
              />
            ))}
          </Box>
        </Section>

        <LeadDriverInfo leadData={leadData} />
      </Box>
    </>
  );
};

export default SharedLeadApp;
