import { Box, Chip, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { STATUS } from "../../shared/const/tenders";

export const BetCard = ({ tender, bet, index }) => {
  const acceptBet = useTendersStore((state) => state.acceptBet);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const isWinning = bet.status === "winning";

  const handleAcceptBet = () => {
    acceptBet(tender.id, index);
    getTenderDetails(tender.id);
  };

  console.log(bet);

  return (
    <Box
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            color: "color.slate_2",
          }}
        >
          {bet.amount}
          {bet.currency}
        </Typography>

        {isWinning ? (
          <Chip size="small" color="success" label={"Победитель"} />
        ) : (
          <Chip
            size="small"
            color="primary"
            label={"Выбрать победителем"}
            onClick={handleAcceptBet}
            sx={{
              boxShadow: 1,
              cursor: "pointer",
              transition: "0.1s",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
          />
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: "color.slate",
        }}
        display="block"
      >
        ID УЧАСТНИКА {bet.participant_id}
      </Typography>
    </Box>
  );
};
