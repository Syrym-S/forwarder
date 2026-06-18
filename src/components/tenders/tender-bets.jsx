import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import Section from "../../shared/ui/section";

const TenderBets = ({ tender }) => {
  const bets = tender?.bets || [];
  const isEmpty = bets.length === 0;

  return (
    <Section titile="Ставки" icon={<PaidOutlinedIcon color="primary" />}>
      {isEmpty && <>Ствок пока что нет</>}
    </Section>
  );
};

export default TenderBets;
