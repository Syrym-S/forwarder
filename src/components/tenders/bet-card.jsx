import { Box, Chip, Typography } from "@mui/material";
import { useTendersStore } from "../../app/store/tenders/tender-store";

export const BetCard = ({ tender, bet }) => {
  const acceptBet = useTendersStore((state) => state.acceptBet);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const isWinning = bet.status === "winning";

  const handleAcceptBet = () => {
    acceptBet(tender.id, bet.index);
    getTenderDetails(tender.id);
  };

  return (
    <Box
      sx={{
        p: 2,
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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 20,
            color: "color.slate_2",
          }}
        >
          {bet.amount} {bet.currency}
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
              borderRadius: 2,
              boxShadow: "none",
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
          color: "text.secondary",
        }}
        display="block"
      >
        {bet.fio} - ИИН:{bet.iin}
      </Typography>
    </Box>
  );
};
