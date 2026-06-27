import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { Controller, useForm, useWatch } from "react-hook-form";
import RenderLeadOptions from "../../components/tenders/render-lead-options";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import RenderFactorOptions from "../../components/tenders/render-factor-options";

const stepFields = ["lead_id", "debSumm"];

const defaultValues = {
  lead_id: "",
  factor_id: "",
  debSumm: "",
  currency: "KZT",
  debCurrency: "",
};

const CreateFactoringForm = ({ openFormModal, handleModalClose }) => {
  const [inputValueLead, setInputValueLead] = useState("");
  const [inputValueFactor, setInputValueFactor] = useState("");

  const [selectedLead, setSelectedLead] = useState();
  const [selectedFactor, setSelectedFactor] = useState();

  const searchedLeads = useLeadsStore((state) => state.searchedLeads);
  const factors = useFactoringStore((state) => state.factors);
  const isSeachLoading = useFactoringStore((state) => state.isSeachLoading);
  const searchFactor = useFactoringStore((state) => state.searchFactor);
  const isSearchLoading = useLeadsStore((state) => state.isSearchLoading);
  const searchHistoryLeads = useLeadsStore((state) => state.searchHistoryLeads);
  const createFactoring = useFactoringStore((state) => state.createFactoring);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const currentLead = useLeadsStore((state) => state.currentLead);
  const isLeadLoading = useLeadsStore((state) => state.isLoading);

  const { control, setValue, trigger, reset } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const formValues = useWatch({ control });

  const handleSubmit = async () => {
    const isValid = await trigger(stepFields);

    if (!isValid) return;

    await createFactoring(formValues);
    await getFactorings();

    reset();
    setSelectedLead(null);
    setSelectedFactor(null);
    handleModalClose();
  };

  useEffect(() => {
    if (selectedLead) {
      getLeadItem(selectedLead?.id);
    }
  }, [selectedLead]);

  useEffect(() => {
    if (!inputValueLead || inputValueLead.length < 2) return;

    const timer = setTimeout(async () => {
      await searchHistoryLeads({
        q: inputValueLead.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValueLead]);

  useEffect(() => {
    if (!inputValueFactor || inputValueFactor.length < 2) return;

    const timer = setTimeout(async () => {
      await searchFactor({
        q: inputValueFactor.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValueFactor]);

  useEffect(() => {
    if (!currentLead) return;

    setValue("debSumm", currentLead.summ, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValue("debCurrency", currentLead.currency, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [currentLead, setValue]);

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
        },
      }}
      open={openFormModal}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: "600",
          }}
        >
          Создание факторинга
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          Выберите завершённый лид, фактор и укажите параметры факторинга
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 1,
          }}
        >
          <Controller
            name="lead_id"
            control={control}
            rules={{
              required: "Выбор лида обязателен",
            }}
            render={({ field, fieldState }) => (
              <Autocomplete
                value={selectedLead}
                inputValue={inputValueLead}
                loading={isSearchLoading}
                options={searchedLeads}
                noOptionsText={<>Ввидте два символа</>}
                onInputChange={(_, value) => {
                  setInputValueLead(value);
                }}
                filterOptions={(items) => items}
                onChange={(_, value) => {
                  field.onChange(value);

                  if (!value) {
                    setSelectedLead(null);

                    setValue("lead_id", "");
                    setValue("debSumm", "");
                    setValue("debCurrency", "");

                    return;
                  }

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
                    error={!!fieldState.error}
                    helperText={
                      fieldState.error
                        ? fieldState.error?.message
                        : "Поиск по городу"
                    }
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
            name="factor_id"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={selectedFactor}
                inputValue={inputValueFactor}
                loading={isSeachLoading}
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

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: 1,
            }}
          >
            <Controller
              name="debSumm"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  label="Cумма дебеторской задолженности"
                  slotProps={{
                    inputLabel: {
                      shrink: isLeadLoading || !!currentLead,
                    },
                    input: {
                      startAdornment: isLeadLoading ? (
                        <CircularProgress size={20} />
                      ) : null,
                    },
                  }}
                  disabled
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="debCurrency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  slotProps={{
                    inputLabel: {
                      shrink: isLeadLoading || !!currentLead,
                    },
                    input: {
                      startAdornment: isLeadLoading ? (
                        <CircularProgress size={20} />
                      ) : null,
                    },
                  }}
                  disabled
                  select
                  label="Валюта"
                  fullWidth
                  size="small"
                >
                  <MenuItem value="KZT">KZT</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="RUB">RUB</MenuItem>
                </TextField>
              )}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 3,
            my: 1,
          }}
        >
          <Button variant="outlined" color="error" onClick={handleModalClose}>
            Отмена
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Создать факторинг
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactoringForm;
