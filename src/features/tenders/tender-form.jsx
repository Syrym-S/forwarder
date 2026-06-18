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
  const { id } = useParams();

  const { control, setValue } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  const searchedLeads = useLeadsStore((state) => state.searchedLeads);
  const searchLeads = useLeadsStore((state) => state.searchLeads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const isSearchLoading = useLeadsStore((state) => state.isSearchLoading);
  const getTenders = useTendersStore((state) => state.getTenders);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const createTender = useTendersStore((state) => state.createTender);
  const updateTender = useTendersStore((state) => state.updateTender);
  const drivers = useDriverStore((state) => state.drivers);
  const getDrivers = useDriverStore((state) => state.getDrivers);

  const [inputValue, setInputValue] = useState("");
  const [selectedLead, setSelectedLead] = useState();

  const onSubmit = async () => {
    console.log(formValues);
    const payload = prepareTenderData(formValues);

    try {
      if (isEdit) {
        await updateTender(id, payload);
        await getTenderDetails(id);
      } else {
        await createTender(payload);
        await getTenders();
      }
      handleCloseForm();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!inputValue) return;

    const timer = setTimeout(async () => {
      await searchLeads({
        q: inputValue.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

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
        <Controller
          name="lead_id"
          control={control}
          render={({ field }) => (
            <Autocomplete
              value={selectedLead}
              inputValue={inputValue}
              loading={isSearchLoading}
              disabled={isEdit}
              options={searchedLeads}
              noOptionsText={<>Ввидте два символа</>}
              onInputChange={(_, value) => {
                setInputValue(value);
              }}
              filterOptions={(items) => items}
              onChange={(_, value) => {
                field.onChange(value);

                setValue("lead_id", value.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                });

                setSelectedLead(value);
              }}
              getOptionLabel={(option) => `${option?.from} - ${option?.to}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Лид"
                  placeholder="Выбирите лида"
                />
              )}
              renderOption={(props, option) => {
                return (
                  <RenderLeadOptions
                    option={option}
                    key={option.id}
                    {...props}
                  />
                );
              }}
            />
          )}
        />
        <Controller
          name="public_date_time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              defaultValue={dayjs(field.value).format("YYYY-MM-DD")}
              value={field.value}
              label="Дата публикации"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
                marginTop: "10px",
              }}
            />
          )}
        />
        <Controller
          name="end_date_time"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              //   defaultValue={dayjs(form.loading_date).format("YYYY-MM-DD")}
              value={field.value}
              label="Дата окончания"
              type="date"
              fullWidth
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
                marginTop: "10px",
              }}
            />
          )}
        />
        <Controller
          name="publication_type"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              label="Публичный тендер"
              control={
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
            />
          )}
        />

        <Controller
          name="max_participants"
          control={control}
          render={({ field }) => (
            <TextField
              sx={{
                display: !formValues.publication_type ? "none" : "flex",
              }}
              {...field}
              value={field.value}
              type="number"
              label="Количество учатсников"
              helperText="0 - без лимит"
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" color="error" onClick={handleCloseForm}>
            Отмена
          </Button>

          <Button variant="contained" onClick={onSubmit}>
            {isEdit ? "Cохранить" : "Создать"}
          </Button>
        </Box>

        <Stack>
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TenderForm;
