import { useTranslation } from "react-i18next";
import { Box, DialogTitle } from "@mui/material";
import React from "react";

const TenderFormHeader = ({ isEdit }) => {
  const { t } = useTranslation();
  return (
    <Box>
      <DialogTitle>
        {isEdit ? t("ui.edit_auction") : t("ui.create_auction_heading")}
      </DialogTitle>
    </Box>
  );
};

export default TenderFormHeader;
