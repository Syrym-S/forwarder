import { Box, Chip } from "@mui/material";
import React from "react";
import Section from "../../shared/ui/section";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";

const CancelledBets = ({ bets }) => {
  return (
    <Section title="Отмененные ставки" icon={<DoDisturbIcon color="error" />}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {bets?.map(
          (bet) =>
            bet.is_own && (
              <>
                {bet.status === "closed" && (
                  <>
                    <Chip
                      variant="outlined"
                      sx={{
                        textDecoration: "line-through",
                        textDecorationThickness: "1.5px",
                        fontWeight: 600,
                      }}
                      label={`${bet.amount} ${bet.currency}`}
                      color="error"
                    />
                  </>
                )}
              </>
            ),
        )}
      </Box>
    </Section>
  );
};

export default CancelledBets;
