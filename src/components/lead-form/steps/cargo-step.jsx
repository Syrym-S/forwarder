import CargoVolumeFields from "./cargo-volume-fields";
import CargoTnvedField from "./cargo-tnved-field";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useOptionsStore } from "../../../app/store/options";
import { StepSection } from "../step-section";
import { STATUS } from "../../../shared/const/tenders";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import { hasCargoValue, isPositiveCargoNumber } from "../../../shared/lib/cargo-volume";
import { isInternationalRoute } from "../../../shared/lib/international-route";

const CargoStep = ({ control, errors, leadStatus }) => {
  const form = useWatch({ control });
  const isInternational = isInternationalRoute(form);
  const tnvedOptions = useOptionsStore((state) => state.tnvedOptions);
  const getLTNVEDOptions = useOptionsStore((state) => state.getLTNVEDOptions);
  const isTNVEDLoading = useOptionsStore((state) => state.isTNVEDLoading);
  const tnvedError = useOptionsStore((state) => state.tnvedError);
  const sections = Array.isArray(tnvedOptions)
    ? tnvedOptions
    : tnvedOptions?.results ?? tnvedOptions?.items ?? tnvedOptions?.data ?? [];

  useEffect(() => {
    const state = useOptionsStore.getState();
    if (isInternational && !state.isTNVEDLoading) getLTNVEDOptions();
  }, [getLTNVEDOptions, isInternational]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cargos",
  });

  const cargos = useWatch({
    control,
    name: "cargos",
  });

  const lastCargo = cargos?.[cargos.length - 1];
  const canEditStatus =
    leadStatus === STATUS.new || leadStatus === STATUS.add_driver;
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
              cargo={field}
              isInternational={isInternational}
              tnvedSections={sections}
              isTNVEDLoading={isTNVEDLoading}
              tnvedError={tnvedError}
              getLTNVEDOptions={getLTNVEDOptions}
            />

            {fields.length !== 1 && (
              <Button
                color="error"
                variant="outlined"
                disabled={leadStatus ? !canEditStatus : false}
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
          disabled={leadStatus ? !canAddCargo : !canAddCargo && !canEditStatus}
          onClick={() =>
            append({
              cargo_type: null,
              name: "",
              tnved_code: "",
              comment: "",
              weight_kg: null,
              length_cm: null,
              width_cm: null,
              height_cm: null,
              cargo_demention: null,
            })
          }
          sx={{
            borderRadius: 2,
          }}
        >
          Добавить груз
        </Button>
      </Box>
    </StepSection>
  );
};

export default CargoStep;

const CargoStepFieldsContent = ({ index, control, cargo, isInternational, tnvedSections, isTNVEDLoading, tnvedError, getLTNVEDOptions }) => {
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
      <FormControllerInput
        name={`cargos.${index}.name`}
        control={control}
        rules={{
          required: "Обязательно нужно указать название товара",
          validate: (value) => !!value?.trim() || "Укажите название груза",
        }}
        required
        label="Название груза"
        size="small"
        fullWidth
      />

      <Controller
        name={`cargos.${index}.type`}
        control={control}
        defaultValue={cargo?.type || ""}
        render={({ field, fieldState }) => (
          <Autocomplete
            inputValue={inputValue}
            options={cargoTypes}
            loading={isCargoTypesLoading}
            loadingText="Загрузка..."
            value={cargoTypes.find((item) => item.name === field.value) || null}
            onChange={(_, value, reason) => {
              field.onChange(value?.name || "");
              setInputValue(value?.name || "");

              if (reason === "clear") {
                getCargoTypes();
              }
            }}
            onInputChange={(_, value) => {
              setInputValue(value);
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
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
          validate: (value) =>
            !hasCargoValue(value) ||
            isPositiveCargoNumber(value) ||
            "Вес должен быть больше 0",
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            type="number"
            slotProps={{ htmlInput: { min: 0, step: "any" } }}
            label="Вес, кг"
            onChange={(e) => {
              const value = e.target.value;

              field.onChange(value === "" ? null : Number(value));
            }}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <CargoTnvedField
        disabled={!isInternational}
        control={control}
        index={index}
        sections={tnvedSections}
        loading={isTNVEDLoading}
        error={tnvedError}
        onRetry={() => getLTNVEDOptions()}
      />

      <CargoVolumeFields control={control} index={index} />

      <FormControllerInput
        name={`cargos.${index}.cargo_price`}
        control={control}
        rules={{
          validate: (value) =>
            !hasCargoValue(value) ||
            Number(value) >= 0 || "Цена не может быть отрицательной",
        }}
        type="number"
        slotProps={{ htmlInput: { min: 0, step: "any" } }}
        label="Цена"
        fullWidth
        size="small"
      />

      <Controller
        name={`cargos.${index}.currency`}
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
              <TextField
                {...params}
                label="Валюта"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            )}
          />
        )}
      />

      <Controller
        name={`cargos.${index}.vat`}
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
        name={`cargos.${index}.description`}
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
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />
    </Box>
  );
};
