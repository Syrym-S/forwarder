import { Box } from "@mui/material";
import React from "react";

const LeadFilePreview = ({ file }) => {
  if (!file) return null;

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
        src={file.url}
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
