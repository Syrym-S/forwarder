import { Box, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import RenderStatus from "../../shared/ui/render-status";
import InfoField from "../../shared/ui/info-field";
import dayjs from "dayjs";

const FactoringCard = ({ factoring }) => {
  return (
    <Box
      // onClick={handleSetDriverDetails}
      tabIndex={0}
      sx={{
        p: 3,
        border: "2px solid",
        borderColor: "divider",
        borderRadius: 4,
        backgroundColor: "background.paper",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "0.2s ease",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary.light",
          boxShadow: "0 8px 24px rgba(33, 150, 243, 0.12)",
        },
      }}
    >
      <Stack spacing={2.5}>
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
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75 }}
            >
              Факторинг
            </Typography>

            <Typography
              sx={{
                lineHeight: 1.3,
                fontSize: {
                  xs: "16px",
                  sm: "18px",
                },
                fontWeight: 500,
              }}
            ></Typography>
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
            }}
          >
            <Chip
              label={`Index# ${factoring?.index}`}
              color="primary"
              variant="outlined"
              sx={{
                borderRadius: 999,
                fontWeight: 600,
                backgroundColor: "rgba(33, 150, 243, 0.04)",
              }}
            />
            <RenderStatus status={factoring?.status} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
          }}
        >
          <InfoField label={"ID лида"} value={factoring?.lead_id} />
          <InfoField
            label={"Дата создания"}
            value={dayjs(factoring?.created_at.date).format("DD-MM-YYYY")}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default FactoringCard;
