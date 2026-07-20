import { Box, CircularProgress } from "@mui/material";
import React from "react";

const ModalLoader = () => {
  return (
    <Box
      sx={{
        height: "55vh",
        position: "relative",
        p: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          border: "red",
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default ModalLoader;
