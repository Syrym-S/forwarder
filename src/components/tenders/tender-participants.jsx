import { useTranslation } from "react-i18next";
import renderDriverOption from "../../shared/ui/render-driver-option";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Section from "./tender-section";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import { useEffect, useState } from "react";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import ParticipantCard from "./participant-card";
import { useDriverStore } from "../../app/store/drivers/driver-store";
import { STATUS } from "../../shared/const/tenders";
import ConfirmModal from "../../shared/ui/confirm-modal";

const TenderParticipants = ({ tender }) => {
  const { t } = useTranslation();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showParticipantField, setShowParticipantField] = useState(false);

  const drivers = useDriverStore((state) => state.drivers);
  const isLoading = useDriverStore((state) => state.isLoading);
  const isAddingLoading = useTendersStore((state) => state.isAddingLoading);
  const isLoadingCurrentTenderLoading = useTendersStore(
    (state) => state.isLoadingCurrentTenderLoading,
  );
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const addParticipant = useTendersStore((state) => state.addParticipant);

  const isEmpty = tender?.participants_count === 0;
  const isPublic = tender?.publication_type === "public";
  const isInLimit = tender?.max_participants > tender?.participants_count;
  const canAddParticipant =
    tender?.status !== STATUS.cancelled && tender?.status !== STATUS.closed;

  const handleOpenConfirmModal = async () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirmModal = async () => {
    setOpenConfirm(false);
  };

  const handleAddParticipant = async () => {
    if (!selectedDriver || selectedDriver.in_black_list === true) return;

    await addParticipant(tender.id, { participant_id: selectedDriver.id });

    handleCloseConfirmModal();

    await getTenderDetails(tender.id);
  };

  const onDriverChange = (_, value) => {
    if (value?.in_black_list === true) return;
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
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{t("ui.participants_2")}</Typography>

          {isInLimit || !isPublic ? (
            <Button
              onClick={handleShowParticipantField}
              variant="outlined"
              disabled={!canAddParticipant}
              startIcon={
                <ControlPointRoundedIcon
                  color={canAddParticipant ? "primary" : ""}
                />
              }
            >{t("ui.add_participant")}</Button>
          ) : (
            <Button variant="outlined" disabled>{t("ui.maximum_participants_2")}</Button>
          )}
        </Box>
      }
      icon={<PeopleAltOutlinedIcon color="primary" />}
    >
      {showParticipantField && (
        <Stack spacing={1.5} sx={{ p: 1.5, mb: 2, bgcolor: "background.default", borderRadius: 2 }}>
          <Autocomplete
            disabled={isLoading}
            options={drivers}
            getOptionDisabled={(option) => option.in_black_list === true}
            getOptionLabel={(option) => option?.fio ?? ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={onDriverChange}
            renderOption={renderDriverOption}
            renderInput={(params) => (
              <TextField
                {...params}
                label={isLoading ? t("ui.loading_2") : t("ui.driver")}
                placeholder={t("ui.select_driver")}
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
              disabled={!selectedDriver || selectedDriver.in_black_list === true}
              variant="contained"
              color="primary"
              onClick={handleOpenConfirmModal}
            >{t("ui.add")}</Button>
            <Button
              disabled={isAddingLoading}
              variant="outlined"
              color="error"
              onClick={handleHideParticipantField}
            >{t("ui.cancel")}</Button>
          </Box>

          <ConfirmModal
            open={openConfirm}
            title={t("ui.add_participant")}
            description={t("ui.adding_participant_starts_auction")}
            onConfirm={handleAddParticipant}
            onCancel={handleCloseConfirmModal}
            isLoading={isAddingLoading}
          />
        </Stack>
      )}

      {isEmpty && <>{t("ui.list_empty_3")}</>}

      {!isEmpty && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "10px",
          }}
        >
          {isLoadingCurrentTenderLoading || isAddingLoading ? (
            <>{t("ui.loading_3")}</>
          ) : (
            tender?.participants?.map((participant) => (
              <ParticipantCard
                tender={tender}
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
