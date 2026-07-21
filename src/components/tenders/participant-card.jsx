import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import dayjs from "dayjs";
import { useTendersStore } from "../../app/store/tenders/tender-store";

const ParticipantCard = ({ tender_id, participant }) => {
  const deleteParticipant = useTendersStore((state) => state.deleteParticipant);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);

  const handleDeleteParticipant = async () => {
    await deleteParticipant(tender_id, participant.participant_id);
    await getTenderDetails(tender_id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.default",
      }}
    >
      <Stack>
        <Typography
          variant="caption"
          sx={{
            color: "color.slate",
          }}
          display="block"
        >
          Дата добавления {dayjs(participant.date).format("YYYY/MM/DD")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              color: "color.slate_2",
            }}
          >
            Имя: {participant.fio}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              color: "color.slate_2",
            }}
          >
            ИИН: {participant.iin}
          </Typography>
        </Box>
      </Stack>

      <IconButton
        variant="outlined"
        color="error"
        onClick={handleDeleteParticipant}
      >
        <DeleteOutlineRoundedIcon />
      </IconButton>
    </Box>
  );
};

export default ParticipantCard;
