import { useTranslation } from "react-i18next";
import { Box, Chip, DialogTitle, Typography } from "@mui/material";
import React from "react";

const FormHeader = ({ isEdit, activeStep, stepsCount }) => {
  const { t } = useTranslation();
  return (
    <DialogTitle
      sx={{
        px: 3,
        pt: 3,
        pb: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
              },
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {isEdit ? t("lead_form.edit_route") : t("lead_form.create_route_title")}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{t("lead_form.fill_request_details")}</Typography>
        </Box>

        <Chip
          label={t("lead_form.step_progress", { value1: activeStep, value2: stepsCount })}
          color="primary"
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: "rgba(33, 150, 243, 0.04)",
          }}
        />
      </Box>
    </DialogTitle>
  );
};

export default FormHeader;
