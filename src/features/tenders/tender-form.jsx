import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useLeadsStore } from "../../app/store/leads-store";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Loader from "../../components/layout/loader";
import { useParams } from "react-router-dom";
import RenderLeadOptions from "../../components/tenders/render-lead-options";
import { useDriverStore } from "../../app/store/driver-store";
import ChooseLeadStep from "./steps/choose-lead-step";
import PublicationTypeStep from "./steps/publication-type-step";

const steps = [
  { id: 1, name: "Выброр лида" },
  { id: 2, name: "Тип публикации" },
];

const stepFields = {
  1: ["lead_id", "public_date_time", "end_date_time"],
};

const prepareTenderData = (form) => {
  return {
    lead_id: form?.lead_id || "",
    public_date_time:
      dayjs(form?.public_date_time).format("YYYY-MM-DD HH:mm:ss") || "",
    end_date_time:
      dayjs(form?.end_date_time).format("YYYY-MM-DD HH:mm:ss") || "",
    type: "shipper",
    publication_type: form?.publication_type ? "public" : "private",
    max_participants: form?.max_participants,
  };
};

const TenderForm = ({
  isEdit = false,
  openForm,
  handleCloseForm,
  defaultValues = {},
}) => {
  const [step, setStep] = useState(1);

  const { id } = useParams();
  const { control, setValue, trigger, getValues } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  const isLoading = useLeadsStore((state) => state.isLoading);
  const getTenders = useTendersStore((state) => state.getTenders);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const createTender = useTendersStore((state) => state.createTender);
  const updateTender = useTendersStore((state) => state.updateTender);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const addParticipant = useTendersStore((state) => state.addParticipant);

  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const renderContent = (step) => {
    switch (step) {
      case 1:
        return (
          <ChooseLeadStep
            control={control}
            isEdit={isEdit}
            setValue={setValue}
            getValues={getValues}
          />
        );
      case 2:
        return (
          <PublicationTypeStep
            control={control}
            formValues={formValues}
            selectedDrivers={selectedDrivers}
            setSelectedDrivers={setSelectedDrivers}
          />
        );
    }
  };

  const isLastStep = steps.length === step;
  const isFirstStep = step === 1;

  const handleNextStep = async () => {
    const isValid = await trigger(stepFields[step]);

    if (!isValid) return;

    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    const payload = prepareTenderData(formValues);

    try {
      if (isEdit) {
        await updateTender(id, payload);

        await Promise.allSettled(
          selectedDrivers.map((driver) =>
            addParticipant(id, {
              participant_id: driver.id,
            }),
          ),
        );
        await getTenderDetails(id);
        await getTenders();
      } else {
        const response = await createTender(payload);

        await Promise.allSettled(
          selectedDrivers.map((driver) =>
            addParticipant(response.data.id, {
              participant_id: driver.id,
            }),
          ),
        );
        await getTenders();
      }
      handleCloseForm();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? "Редактирование тендера" : "Создание тендера"}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {renderContent(step)}
        {/* <Stack>
          <Autocomplete
            disabled={isLoading}
            options={drivers}
            getOptionLabel={(option) => option?.fio ?? ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            // onChange={onDriverChange}
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
              variant="contained"
              color="primary"
              // onClick={handleAddParticipant}
            >
              Добавить
            </Button>
            <Button
              variant="outlined"
              color="error"
              // onClick={handleHideParticipantField}
            >
              Отмена
            </Button>
          </Box>
        </Stack> */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isFirstStep ? (
            <Button variant="outlined" color="error" onClick={handleCloseForm}>
              Отмена
            </Button>
          ) : (
            <Button variant="outlined" color="error" onClick={handlePrevStep}>
              Назад
            </Button>
          )}

          {isLastStep ? (
            <Button variant="contained" onClick={onSubmit}>
              {isEdit ? "Cохранить" : "Создать"}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNextStep}>
              Дальше
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TenderForm;
