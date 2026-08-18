import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import { Controller, useForm } from "react-hook-form";
import RenderFactorOptions from "../../components/tenders/render-factor-options";
import FactorLineSettings from "../../components/factor-line/factor-line-settings";

const prepareData = (data, factorDetails) => {
  const result = {
    factor_id: data.factor_id,
  };

  if (factorDetails.is_sum_changeable) {
    result.summ_max = data.summ_max;
  }
  if (factorDetails.is_period_changeable) {
    result.period_days = data.period_days;
  }
  if (factorDetails.is_currency_changeable) {
    result.currency = data.currency;
  }

  return result;
};

const FactorLineForm = ({ open, setOpenForm, setSuccessModal }) => {
  const [inputValueFactor, setInputValueFactor] = useState("");
  const [selectedFactor, setSelectedFactor] = useState();

  const factors = useFactoringStore((state) => state.factors);
  const factorDetails = useFactoringStore((state) => state.factorDetails);
  const getFactorDetails = useFactoringStore((state) => state.getFactorDetails);
  const isFactorsLoading = useFactoringStore((state) => state.isFactorsLoading);
  const getFactors = useFactoringStore((state) => state.getFactors);
  const error = useFactoringStore((state) => state.error);
  const createFactoringLine = useFactoringStore(
    (state) => state.createFactoringLine,
  );

  const { control, reset, setValue, handleSubmit } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      factor_id: "",
      summ_max: "",
      period_days: "",
      currency: "",
    },
  });

  const onSubmit = async (data) => {
    const preparedData = prepareData(data, factorDetails);

    createFactoringLine(preparedData);
    reset({
      factor_id: selectedFactor?.id ?? "",
      summ_max: factorDetails.sum_default ?? "",
      period_days: factorDetails.period_days ?? "",
      currency: factorDetails.currency ?? "",
    });
    setSuccessModal(true);
  };

  useEffect(() => {
    if (!factorDetails) return;

    reset({
      factor_id: selectedFactor?.id ?? "",
      summ_max: factorDetails.sum_default ?? "",
      period_days: factorDetails.period_days ?? "",
      currency: factorDetails.currency ?? "",
    });
  }, [factorDetails, selectedFactor, reset]);

  useEffect(() => {
    if (selectedFactor) {
      getFactorDetails(selectedFactor.id);
    }
  }, [selectedFactor]);

  useEffect(() => {
    getFactors();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={() => setOpenForm(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Cоздание заявки</DialogTitle>
      <DialogContent>
        <Controller
          name="factor_id"
          control={control}
          render={({ field }) => (
            <Autocomplete
              value={selectedFactor}
              inputValue={inputValueFactor}
              loading={isFactorsLoading}
              options={factors || []}
              noOptionsText={<>Ввидте два символа</>}
              onInputChange={(_, value) => {
                setInputValueFactor(value);
              }}
              filterOptions={(items) => items}
              onChange={(_, value) => {
                field.onChange(value);

                setValue("factor_id", value.id, {
                  shouldDirty: true,
                  shouldTouch: true,
                });

                setSelectedFactor(value);
              }}
              getOptionLabel={(option) =>
                `[ФИО:${option?.fio}] | [Компания: ${option?.company_name}]`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Фактор"
                  placeholder="Выбор фактора"
                  helperText="Поиск по БИН или ИИН , введите все 12 символов"
                />
              )}
              renderOption={(props, option) => {
                return (
                  <RenderFactorOptions
                    option={option}
                    key={option.id}
                    {...props}
                  />
                );
              }}
            />
          )}
        />

        {selectedFactor && <FactorLineSettings />}

        <Box
          sx={{
            py: 2,
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
          }}
        >
          <Controller
            name="summ_max"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={!factorDetails || !factorDetails.is_sum_changeable}
                label="Максимальная сумма"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  htmlInput: {
                    min: 0,
                  },
                }}
              />
            )}
          />

          <Controller
            name="period_days"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={!factorDetails || !factorDetails.is_period_changeable}
                label="Период, дней"
                type="number"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                slotProps={{
                  htmlInput: {
                    min: 1,
                  },
                }}
              />
            )}
          />

          <Controller
            name="currency"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                disabled={
                  !factorDetails || !factorDetails.is_currency_changeable
                }
                label="Валюта"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
        <Button
          disabled={error}
          variant="outlined"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Создать заявку
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FactorLineForm;
