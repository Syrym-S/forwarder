import { Box, DialogTitle } from "@mui/material";
import React from "react";

const TenderFormHeader = ({ isEdit }) => {
  return (
    <Box>
      <DialogTitle>
        {isEdit ? "Редактирование аукциона" : "Создание аукциона"}
      </DialogTitle>
    </Box>
  );
};

export default TenderFormHeader;
