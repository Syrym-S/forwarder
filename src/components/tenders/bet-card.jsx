import { Box, Typography } from "@mui/material";
import RenderStatus from "../../shared/ui/render-status";

export const BetCard = ({ bet }) => {
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
      <Typography
        variant="caption"
        sx={{
          color: "color.slate",
        }}
        display="block"
      >
        ID УЧАСТНИКА {bet.participant_id}
      </Typography>

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
        <RenderStatus status={bet.status} />
      </Box>
    </Box>
  );
};
