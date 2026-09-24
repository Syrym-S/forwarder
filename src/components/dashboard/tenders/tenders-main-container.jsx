import { Box } from "@mui/material";
import CustomerCreatedTenders from "./customer-created-tenders";
import ForwarderCreatedTenders from "./forwarder-created-tenders";

const TendersMainContainer = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "repeat(2, minmax(0, 1fr))",
        },
        gap: 2,
        width: "100%",
        alignItems: "stretch",
      }}
    >
      <CustomerCreatedTenders />

      <ForwarderCreatedTenders />
    </Box>
  );
};

export default TendersMainContainer;
