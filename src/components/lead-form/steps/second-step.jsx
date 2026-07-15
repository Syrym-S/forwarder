import {
  Autocomplete,
  Box,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { StepSection } from "../step-section";
import { useOptionsStore } from "../../../app/store/options";
import { useEffect, useState } from "react";

export function SecondStep({ control, errors }) {
  const cargoTypes = useOptionsStore((state) => state.cargoTypes);
  const getCargoTypes = useOptionsStore((state) => state.getCargoTypes);
  const searchCargoType = useOptionsStore((state) => state.searchCargoType);
  const currencies = useOptionsStore((state) => state.currencies);
  const getCurrencies = useOptionsStore((state) => state.getCurrencies);
  const isCargoTypesLoading = useOptionsStore(
    (state) => state.isCargoTypesLoading,
  );

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getCargoTypes();
    getCurrencies();
  }, []);

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

  return (
    <StepSection title="Груз и оплата">
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
          name="type"
          control={control}
          defaultValue={null}
          render={({ field, fieldState }) => (
            <Autocomplete
              inputValue={inputValue}
              options={cargoTypes}
              loading={isCargoTypesLoading}
              loadingText="Загрузка..."
              value={
                cargoTypes.find((item) => item.name === field.value) || null
              }
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
          name="weight_kg"
          control={control}
          rules={{
            required: "Укажите вес",
            validate: (value) =>
              Number(value) > 0 || "Вес должен быть больше 0",
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
              error={Boolean(errors.weightKg)}
              helperText={errors.weightKg?.message}
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
            name="length_cm"
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
                error={Boolean(errors.cargoLengthCm)}
                helperText={errors.cargoLengthCm?.message}
              />
            )}
          />

          <Controller
            name="width_cm"
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
                error={Boolean(errors.cargoWidthCm)}
                helperText={errors.cargoWidthCm?.message}
              />
            )}
          />

          <Controller
            name="height_cm"
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
                error={Boolean(errors.cargoHeightCm)}
                helperText={errors.cargoHeightCm?.message}
              />
            )}
          />
        </Box>

        <Controller
          name="price"
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
              error={Boolean(errors.price)}
              helperText={errors.price?.message}
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
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
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
    </StepSection>
  );
}
