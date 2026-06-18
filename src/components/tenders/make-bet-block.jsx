import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import React from "react";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import Section from "../../shared/ui/section";
import CancelledBets from "./cancelled-bets";

const MakeBetBlock = ({ tender, setShowBetField }) => {
  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );
  const cancelBet = useTendersStore((state) => state.cancelBet);

  const ownBet = tender?.bets.find((bet) => bet.is_own === true);
  const isActive = tender?.bets.find((bet) => bet.status !== "closed");

  const isBetExist = !!ownBet && !!isActive;

  const handleShowBetField = () => {
    setShowBetField(true);
  };

  const handleCancelBet = async (bet_index) => {
    await cancelBet(tender.id, bet_index);
    await getCustomerTenderDetails(tender.id);
  };

  return (
    <Box>
      {!isBetExist && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleShowBetField}
        >
          {"Сделать ставку"}
        </Button>
      )}
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        {tender?.bets.map(
          (bet, index) =>
            bet.is_own && (
              <>
                {bet.status !== "closed" && (
                  <>
                    {" "}
                    <Button
                      variant={"outlined"}
                      color={"error"}
                      onClick={() => handleCancelBet(index)}
                    >
                      {"Отменить ставку"}
                    </Button>
                    <TextField
                      label="Текущая ставка"
                      value={`${bet.amount} ${bet.currency}`}
                      InputProps={{
                        readOnly: true,
                        tabIndex: -1,
                      }}
                      sx={{
                        color: "blue",
                        pointerEvents: "none",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "success.main",
                        },
                        "& .MuiInputLabel-root": {
                          color: "success.main",
                        },
                        "& .MuiInputBase-input": {
                          color: "success.main",
                          cursor: "default",
                        },
                      }}
                      size="sm"
                      color="success"
                    />
                  </>
                )}
              </>
            ),
        )}
      </Box>

      <CancelledBets bets={tender?.bets} />
    </Box>
  );
};

export default MakeBetBlock;
