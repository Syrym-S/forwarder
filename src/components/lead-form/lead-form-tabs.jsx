import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";

import {
  Box,
  ButtonBase,
  Collapse,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

const LeadFormTabs = ({ steps, activeStep, setActiveStep, isEdit }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [isCollapsed, setCollapsed] = useState(false);

  const currentStep = steps.find((step) => step.id === activeStep);

  return (
    <Box
      sx={{
        p: {
          xs: 1,
          sm: 0,
        },
        mb: {
          xs: 0,
          sm: 2,
        },
        backgroundColor: {
          xs: "white",
          sm: "inherit",
        },
        borderBottom: { xs: "1px solid", sm: "none" },
        borderColor: { xs: "divider", sm: "none" },
      }}
    >
      <ButtonBase
        type="button"
        onClick={() => setCollapsed((collapsed) => !collapsed)}
        sx={{
          display: { xs: "flex", sm: "none" },
          width: "100%",
          justifyContent: "space-between",
          gap: 1,
          p: 1.25,
          borderRadius: 2,
          color: "primary.main",
          textAlign: "start",
          "&.Mui-focusVisible": {
            outline: "2px solid",
            outlineOffset: 2,
          },
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          {currentStep?.id}. {currentStep?.label}
        </Typography>
        <ExpandMoreRounded
          fontSize="small"
          sx={{
            flexShrink: 0,
            transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: (theme) => theme.transitions.create("transform"),
          }}
        />
      </ButtonBase>

      <Collapse in={!isMobile || !isCollapsed}>
        <Box
          sx={{
            pt: { xs: 1, sm: 0 },
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
                    color:
                      isEdit || isAvailable ? "primary.main" : "color.slate_2",
                  }}
                >
                  {step.id}. {step.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
};

export default LeadFormTabs;
