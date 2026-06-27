import {
  Box,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import Section from "../../shared/ui/section";
import CancelledBets from "./cancelled-bets";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CancelBetModal from "../../features/tenders/confirm-actions/cancel-bet-modal";

const MakeBetBlock = ({ tender, setShowBetField }) => {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );
  const cancelBet = useTendersStore((state) => state.cancelBet);
  const isLoading = useTendersStore((state) => state.isLoading);

  const ownBet = tender?.bets.find((bet) => bet.is_own === true);
  const isActive = tender?.bets.find((bet) => bet.status !== "closed");

  const isBetExist = !!ownBet && !!isActive;

  const handleShowBetField = () => {
    setShowBetField(true);
  };

  const handleOpenCancelModal = () => {
    setOpenCancelModal(true);
  };
  const handleCloseCancelModal = () => {
    setOpenCancelModal(false);
  };

  const handleCancelBet = async (bet_index) => {
    await cancelBet(tender.id, bet_index);
    await getCustomerTenderDetails(tender.id);
  };

  if (isLoading)
    return (
      <Section title="Ваша ставка" icon={<PaidOutlinedIcon color="primary" />}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      </Section>
    );

  return (
    <Section title="Ваша ставка" icon={<PaidOutlinedIcon color="primary" />}>
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
                      onClick={handleOpenCancelModal}
                    >
                      {"Отменить ставку"}
                    </Button>
                    <CancelBetModal
                      bet={bet}
                      confirmCancel={() => handleCancelBet(index)}
                      openCancelModal={openCancelModal}
                      handleCloseCancelModal={handleCloseCancelModal}
                    />
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
    </Section>
  );
};

export default MakeBetBlock;
