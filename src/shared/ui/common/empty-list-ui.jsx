import { Alert } from "@mui/material";
import React from "react";

const EmptyListUi = ({ text }) => {
  return (
    <Alert
      severity="info"
      sx={{
        width: {
          xs: "100%",
        },
        my: 1,
        mx: "auto",
      }}
    >
      {text}
    </Alert>
  );
};

export default EmptyListUi;
