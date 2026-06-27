import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Section from "../../shared/ui/section";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import ParticipantCard from "./participant-card";
import { useDriverStore } from "../../app/store/drivers/driver-store";

const TenderParticipants = ({ tender }) => {
  const [selectedDriver, setSelectedDriver] = useState({});
  const [showParticipantField, setShowParticipantField] = useState(false);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const isAddingLoading = useTendersStore((state) => state.isAddingLoading);
  const isParticipantsLoading = useTendersStore((state) => state.isLoading);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const addParticipant = useTendersStore((state) => state.addParticipant);

  const isEmpty = tender?.participants_count === 0;
  const isInLimit = tender?.max_participants > tender?.participants_count;

  const handleAddParticipant = async () => {
    await addParticipant(tender.id, { participant_id: selectedDriver.id });
    await getTenderDetails(tender.id);
  };

  const onDriverChange = (_, value) => {
    setSelectedDriver(value);
  };

  const handleShowParticipantField = () => {
    setShowParticipantField(true);
  };

  const handleHideParticipantField = () => {
    setShowParticipantField(false);
  };

  useEffect(() => {
    getDrivers();
  }, []);

  return (
    <Section
      title={
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Участники</Typography>

          {isInLimit ? (
            <Button
              onClick={handleShowParticipantField}
              variant="outlined"
              startIcon={<ControlPointRoundedIcon color="primary" />}
            >
              Добавить участника
            </Button>
          ) : (
            <Button variant="outlined" disabled>
              Максимально количество участников
            </Button>
          )}
        </Box>
      }
      icon={<PeopleAltOutlinedIcon color="primary" />}
    >
      {showParticipantField && (
        <Stack>
          <Autocomplete
            disabled={isLoading}
            options={drivers}
            getOptionLabel={(option) => option?.fio ?? ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={onDriverChange}
            renderOption={(props, option) => {
              return (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontWeight={700}>{option.fio}</Typography>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={isLoading ? "...Загрузка данных" : "Водитель"}
                placeholder="Выберите водителя"
              />
            )}
          />

          <Box
            sx={{
              my: 1,
              display: "flex",
              gap: "10px",
            }}
          >
            <Button
              disabled={isAddingLoading}
              variant="contained"
              color="primary"
              onClick={handleAddParticipant}
            >
              {isAddingLoading ? "...Добавление" : "Добавить"}
            </Button>
            <Button
              disabled={isAddingLoading}
              variant="outlined"
              color="error"
              onClick={handleHideParticipantField}
            >
              Отмена
            </Button>
          </Box>
        </Stack>
      )}
      {isEmpty && <>Список пустой</>}

      {!isEmpty && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "10px",
          }}
        >
          {isParticipantsLoading || isAddingLoading ? (
            <>...Загрузка</>
          ) : (
            tender?.participants?.map((participant) => (
              <ParticipantCard
                tender_id={tender.id}
                participant={participant}
                key={participant.participant_id}
              />
            ))
          )}
        </Box>
      )}
    </Section>
  );
};

export default TenderParticipants;
