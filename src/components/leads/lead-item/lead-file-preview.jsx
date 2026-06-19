import { Box } from "@mui/material";
import React from "react";

const LeadFilePreview = ({ file }) => {
  if (!file) return null;

  const pdfUrl = `https://forwarder.360logistics.kz/wp-content/uploads/${file.path}`;
  return (
    <Box
      sx={{
        height: {
          xs: "70vh",
          sm: "75vh",
        },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        backgroundColor: "grey.100",
      }}
    >
      <Box
        component="iframe"
        src={`${pdfUrl}#view=FitH`}
        title={file.name || file.path || "PDF preview"}
        sx={{
          display: "block",
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Box>
  );
};

export default LeadFilePreview;
