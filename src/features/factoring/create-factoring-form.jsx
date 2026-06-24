import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { Controller, useForm, useWatch } from "react-hook-form";
import RenderLeadOptions from "../../components/tenders/render-lead-options";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";

const defaultValues = {
  lead_id: "6a3a6987de0328454f0e9152",
  debSumm: "",
  currency: "KZT",
  debCurrency: "KZT",
};

const CreateFactoringForm = ({ openFormModal, handleModalClose }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedLead, setSelectedLead] = useState();

  const searchedLeads = useLeadsStore((state) => state.searchedLeads);
  const isSearchLoading = useLeadsStore((state) => state.isSearchLoading);
  const searchHistoryLeads = useLeadsStore((state) => state.searchHistoryLeads);
  const createFactoring = useFactoringStore((state) => state.createFactoring);
  const getFactorings = useFactoringStore((state) => state.getFactorings);

  const { control, setValue } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const formValues = useWatch({ control });

  const handleSubmit = async () => {
    await createFactoring(formValues);
    await getFactorings();

    handleModalClose();
  };

  useEffect(() => {
    if (!inputValue) return;

    const timer = setTimeout(async () => {
      await searchHistoryLeads({
        q: inputValue.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <Dialog
      open={openFormModal}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Создание факторинга</DialogTitle>
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
                inputValue={inputValue}
                loading={isSearchLoading}
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
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
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
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  size="small"
                  label="Cумма дебеторской задолженности"
                />
              )}
            />
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
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
            justifyContent: "space-between",
            my: 1,
          }}
        >
          <Button variant="outlined" color="error" onClick={handleModalClose}>
            Отмена
          </Button>
          <Button variant="outlined" color="primary" onClick={handleSubmit}>
            Создать
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactoringForm;
