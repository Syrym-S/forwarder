import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import { Box, Chip } from "@mui/material";
import React from "react";
import Section from "./tender-section";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { STATUS } from "../../shared/const/tenders";

const CancelledBets = ({ bets }) => {
  const { t } = useTranslation();
  return (
    <Section title={t("ui.cancelled_bids")} icon={<DoDisturbIcon color="error" />}>
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
                      label={`${moneySpacingFormat(bet.amount)} ${bet.currency}`}
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
