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
import ConfirmModal from "../../shared/ui/confirm-modal";

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
              Нельзя делать ставки, пока аукцион не активен
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
          const confirmCancel = () => {
            handleCancelBet(index);
          };

          return (
            bet.is_own && (
              <>
                {bet.status !== STATUS.closed && (
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{
                        mb: 1.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.7rem",
                          color: "text.secondary",
                          mb: 0.25,
                        }}
                      >
                        Комментарий
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 500,
                          wordBreak: "break-word",
                        }}
                      >
                        {bet.comment || "-"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                            mb: 0.5,
                          }}
                        >
                          Сумма
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "primary.main",
                          }}
                        >
                          {bet.amount} {bet.currency}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            color: "text.secondary",
                            mb: 0.5,
                          }}
                        >
                          Статус
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minHeight: 26,
                          }}
                        >
                          <RenderStatus status={bet.status} />
                        </Box>
                      </Box>
                    </Box>

                    {canBeDeleted && (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleOpenCancelModal}
                        sx={{
                          mt: 1.5,
                          borderRadius: 1.5,
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.85rem",
                          },
                          fontWeight: 500,
                          py: 0.8,
                        }}
                      >
                        Отменить ставку
                      </Button>
                    )}

                    <ConfirmModal
                      open={openCancelModal}
                      title="Отмена ставки"
                      description={
                        <>
                          <Typography>
                            Вы уверены что хотите отменить ставку на этот
                            аукцион?
                          </Typography>
                          <Typography>
                            Сумма ставки: {bet.amount} {bet.currency}
                          </Typography>
                        </>
                      }
                      onCancel={handleCloseCancelModal}
                      onConfirm={confirmCancel}
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
