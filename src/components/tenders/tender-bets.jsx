import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Section from "./tender-section";
import { Box } from "@mui/material";
import { BetCard } from "./bet-card";
import { STATUS } from "../../shared/const/tenders";

const TenderBets = ({ tender }) => {
  const bets = tender?.bets?.filter((bet) => bet.status !== "closed") || [];
  const isEmpty = bets.length === 0;
  const isClosed = tender.status === STATUS.closed;
  const winningBet = tender?.bets?.find((bet) => bet.status === "winning");

  return (
    <Section
      title={`Ставки · ${bets?.length}`}
      icon={<PaidOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 1,
        }}
      >
        {isEmpty && <>Ставок пока что нет</>}

        {!isEmpty && (
          <>
            {isClosed ? (
              <>
                <BetCard bet={winningBet} tender={tender} />
              </>
            ) : (
              bets.map((bet) => <BetCard key={bet.id || bet.index} bet={bet} tender={tender} />)
            )}
          </>
        )}
      </Box>
    </Section>
  );
};

export default TenderBets;
