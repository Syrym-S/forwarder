import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import { Box } from "@mui/system";
import React from "react";

const EmptyListUI = () => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DangerousOutlinedIcon
        sx={{
          fontSize: "4rem",
        }}
      />
      <Typography>{t("ui.nothing_found")}</Typography>
    </Box>
  );
};

export default EmptyListUI;
