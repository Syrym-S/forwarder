import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Section from "../../shared/ui/section";
import InfoField from "../../shared/ui/info-field";
import { Box } from "@mui/material";
import { BetCard } from "./bet-card";

const TenderBets = ({ tender }) => {
  const bets = tender?.bets || [];
  const isEmpty = bets.length === 0;

  return (
    <Section
      title={`Ставки (кол.во ${bets?.length})`}
      icon={<PaidOutlinedIcon color="primary" />}
    >
      {isEmpty && <>Ставок пока что нет</>}

      {!isEmpty && (
        <>
          {bets.map((bet) => (
            <BetCard bet={bet} />
          ))}
        </>
      )}
    </Section>
  );
};

export default TenderBets;
