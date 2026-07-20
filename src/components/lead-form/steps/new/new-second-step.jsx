import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { StepSection } from "../../step-section";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useOptionsStore } from "../../../../app/store/options";
import { useState } from "react";
import { useEffect } from "react";

const NewSecondStep = ({ control, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cargos",
  });

  const cargos = useWatch({
    control,
    name: "cargos",
  });

  const lastCargo = cargos?.[cargos.length - 1];

  const canAddCargo = lastCargo?.name?.trim();

  return (
    <StepSection title="Груз и оплата">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <CargoStepFieldsContent
              key={field.id}
              index={index}
              control={control}
              errors={errors}
              remove={remove}
            />

            {fields.length !== 1 && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => remove(index)}
                sx={{
                  my: 2,
                }}
              >
                Убрать груз
              </Button>
            )}
          </Box>
        ))}

        <Button
          variant="outlined"
          disabled={!canAddCargo}
          onClick={() =>
            append({
              cargo_type: null,
              name: "",
              comment: "",
              weight_kg: null,
              length_cm: null,
              width_cm: null,
              height_cm: null,
            })
          }
        >
          Добавить груз
        </Button>
      </Box>
    </StepSection>
  );
};

export default NewSecondStep;

const CargoStepFieldsContent = ({ index, control }) => {
  const searchCargoType = useOptionsStore((state) => state.searchCargoType);
  const cargoTypes = useOptionsStore((state) => state.cargoTypes);
  const getCargoTypes = useOptionsStore((state) => state.getCargoTypes);
  const isCargoTypesLoading = useOptionsStore(
    (state) => state.isCargoTypesLoading,
  );
  const currencies = useOptionsStore((state) => state.currencies);
  const getCurrencies = useOptionsStore((state) => state.getCurrencies);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const value = inputValue?.trim();

    const timer = setTimeout(() => {
      if (!value) {
        return;
      }

      searchCargoType({ q: value });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    getCargoTypes();
    getCurrencies();
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
        },
        gap: 2,
      }}
    >
      <Controller
        name={`cargos.${index}.name`}
        control={control}
        render={({ field }) => (
          <TextField {...field} label="Название груза" size="small" fullWidth />
        )}
      />

      <Controller
        name={`cargos.${index}.type`}
        control={control}
        defaultValue={null}
        render={({ field, fieldState }) => (
          <Autocomplete
            inputValue={inputValue}
            options={cargoTypes}
            loading={isCargoTypesLoading}
            loadingText="Загрузка..."
            value={cargoTypes.find((item) => item.name === field.value) || null}
            onChange={(_, value) => {
              field.onChange(value?.name || "");
              setInputValue(value?.name || "");
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Тип груза"
                size="small"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name={`cargos.${index}.weight_kg`}
        control={control}
        rules={{
          required: "Укажите вес",
          validate: (value) => Number(value) > 0 || "Вес должен быть больше 0",
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            label="Вес, кг"
            onChange={(e) => {
              const value = e.target.value;

              field.onChange(value === "" ? null : Number(value));
            }}
            fullWidth
            size="small"
          />
        )}
      />

      <Box
        sx={{
          gridColumn: {
            xs: "auto",
            sm: "1 / -1",
          },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        <Controller
          name={`cargos.${index}.length_cm`}
          control={control}
          rules={{
            required: "Укажите длину",
            validate: (value) =>
              Number(value) > 0 || "Длина должна быть больше 0",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Длина, см"
              fullWidth
              size="small"
            />
          )}
        />

        <Controller
          name={`cargos.${index}.width_cm`}
          control={control}
          rules={{
            required: "Укажите ширину",
            validate: (value) =>
              Number(value) > 0 || "Ширина должна быть больше 0",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Ширина, см"
              fullWidth
              size="small"
            />
          )}
        />

        <Controller
          name={`cargos.${index}.height_cm`}
          control={control}
          rules={{
            required: "Укажите высоту",
            validate: (value) =>
              Number(value) > 0 || "Высота должна быть больше 0",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              label="Высота, см"
              fullWidth
              size="small"
            />
          )}
        />
      </Box>

      <Controller
        name={`cargos.${index}.price`}
        control={control}
        rules={{
          required: "Укажите цену",
          validate: (value) =>
            Number(value) >= 0 || "Цена не может быть отрицательной",
        }}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            label="Цена"
            fullWidth
            size="small"
          />
        )}
      />

      <Controller
        name="currency"
        control={control}
        defaultValue="KZT"
        render={({ field }) => (
          <Autocomplete
            options={currencies || []}
            value={
              currencies?.find((item) => item.code === field.value) ?? null
            }
            onChange={(_, newValue) => {
              field.onChange(newValue?.code ?? "");
            }}
            getOptionLabel={(option) => `${option.code} - ${option.fullname}`}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            renderInput={(params) => (
              <TextField {...params} label="Валюта" size="small" />
            )}
          />
        )}
      />

      <Controller
        name="vat"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
              />
            }
            label="С НДС"
          />
        )}
      />

      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Комментарий"
            fullWidth
            multiline
            minRows={3}
            size="small"
            sx={{
              gridColumn: {
                xs: "auto",
                sm: "1 / -1",
              },
            }}
          />
        )}
      />
    </Box>
  );
};
