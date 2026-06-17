import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useLeadsStore } from "../../app/store/leads-store";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { useEffect } from "react";
import dayjs from "dayjs";
import Loader from "../../components/layout/loader";
import { useParams } from "react-router-dom";

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

  const leads = useLeadsStore((state) => state.leads);
  const isLoading = useLeadsStore((state) => state.isLoading);
  const getTenders = useTendersStore((state) => state.getTenders);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const createTender = useTendersStore((state) => state.createTender);
  const updateTender = useTendersStore((state) => state.updateTender);

  const onSubmit = async () => {
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
    console.log(formValues);
  }, [formValues]);

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
              disabled={isEdit}
              options={leads || []}
              value={leads?.find((lead) => lead.id === field.value) || null}
              onChange={(_, value) => {
                field.onChange(value);

                setValue("lead_id", value.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              getOptionLabel={(option) => option?.id || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Лид"
                  placeholder="Выбирите лида"
                />
              )}
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
                    <Typography fontWeight={700}>{option.id}</Typography>
                  </Box>
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
      </DialogContent>
    </Dialog>
  );
};

export default TenderForm;
