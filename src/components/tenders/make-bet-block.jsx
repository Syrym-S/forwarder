import {
  Alert,
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
import { STATUS } from "../../shared/const/tenders";
import RenderStatus from "../../shared/ui/render-status";

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

  const isTenderActive = tender?.status === STATUS.active;

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
        <>
          <Button
            disabled={!isTenderActive}
            variant="contained"
            color="primary"
            onClick={handleShowBetField}
          >
            Сделать ставку
          </Button>
          {!isTenderActive && (
            <Alert
              severity="warning"
              sx={{
                fontSize: "0.8rem",
                my: 1,
              }}
            >
              Нельзя делать ставки, пока тендер не активен
            </Alert>
          )}
        </>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "10px",
        }}
      >
        {tender?.bets.reverse().map((bet, index) => {
          const canBeDeleted =
            bet.status !== STATUS.winning && tender.status !== STATUS.closed;

          return (
            bet.is_own && (
              <>
                {bet.status !== STATUS.closed && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <Typography>
                        Комментарий: {bet.comment === "" ? "-" : bet.comment}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                          }}
                        >
                          Cумма
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "1.1rem",
                            color: "#42a5f5",
                          }}
                        >
                          {bet.amount} {bet.currency}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                          }}
                        >
                          Cтатус
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "1.1rem",
                          }}
                        >
                          <RenderStatus status={bet.status} />
                        </Typography>
                      </Box>
                      {canBeDeleted && (
                        <Button
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.9rem",
                            },
                            gridColumn: 2,
                            borderRadius: 1,
                          }}
                          variant={"outlined"}
                          color={"error"}
                          onClick={handleOpenCancelModal}
                        >
                          {"Отменить ставку"}
                        </Button>
                      )}
                    </Box>

                    <CancelBetModal
                      bet={bet}
                      confirmCancel={() => handleCancelBet(index)}
                      openCancelModal={openCancelModal}
                      handleCloseCancelModal={handleCloseCancelModal}
                    />
                  </Box>
                )}
              </>
            )
          );
        })}
      </Box>
    </Section>
  );
};

export default MakeBetBlock;
