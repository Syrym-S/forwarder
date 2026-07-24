import { Box } from "@mui/material";
import React from "react";
import CustomerCreatedTenders from "./customer-created-tenders";
import ForwarderCreatedTenders from "./forwarder-created-tenders";

const TendersMainContainer = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1fr 1fr",
        },
        gap: 1,
        width: "100%",
        height: {
          xs: "100vh",
          lg: "50vh",
        },
        mt: 5,
      }}
    >
      <CustomerCreatedTenders />

      <ForwarderCreatedTenders />
    </Box>
  );
};

export default TendersMainContainer;
