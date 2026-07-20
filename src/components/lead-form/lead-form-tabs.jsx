import { Box, Typography } from "@mui/material";
import React from "react";

const LeadFormTabs = ({ steps, activeStep, setActiveStep, isEdit }) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          sm: "repeat(4, 1fr)",
        },
        gap: 1,
      }}
    >
      {steps.map((step) => {
        const isAvailable = activeStep >= step.id;

        return (
          <Box
            key={step.id}
            onClick={() => {
              if (isEdit || isAvailable) {
                setActiveStep(step.id);
              }
            }}
            sx={{
              cursor: (isEdit || isAvailable) && "pointer",
              p: 1.25,
              borderRadius: 2,
              border: "1px solid",
              borderColor:
                isEdit || isAvailable ? "primary.main" : "color.slate",
              backgroundColor:
                isEdit || isAvailable
                  ? "rgba(33, 150, 243, 0.06)"
                  : "background.slate",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: isEdit || isAvailable ? "primary.main" : "color.slate_2",
              }}
            >
              {step.id}. {step.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default LeadFormTabs;
