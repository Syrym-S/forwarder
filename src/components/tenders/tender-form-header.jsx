import { Box, DialogTitle } from "@mui/material";
import React from "react";

const TenderFormHeader = ({ isEdit }) => {
  return (
    <Box>
      <DialogTitle>
        {isEdit ? "Редактирование тендера" : "Создание тендера"}
      </DialogTitle>
    </Box>
  );
};

export default TenderFormHeader;
