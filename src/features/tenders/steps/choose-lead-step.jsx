import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import RenderLeadOptions from "../../../components/tenders/render-lead-options";
import { useLeadsStore } from "../../../app/store/leads/leads-store";

const ChooseLeadStep = ({ control, setValue, isEdit, getValues }) => {
  const searchedLeads = useLeadsStore((state) => state.searchedLeads);
  const isSearchLoading = useLeadsStore((state) => state.isSearchLoading);
  const searchLeads = useLeadsStore((state) => state.searchLeads);
  const [inputValue, setInputValue] = useState("");
  const [selectedLead, setSelectedLead] = useState();

  useEffect(() => {
    if (!inputValue) return;

    const timer = setTimeout(async () => {
      await searchLeads({
        q: inputValue.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <>
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
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
            renderOption={(props, option) => {
              return (
                <RenderLeadOptions option={option} key={option.id} {...props} />
              );
            }}
          />
        )}
      />
      <Controller
        name="public_date_time"
        control={control}
        rules={{
          required: "Выберите дату начала",
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            defaultValue={dayjs(field.value).format("YYYY-MM-DD")}
            value={field.value}
            label="Дата публикации"
            type="date"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
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
        rules={{
          required: "Укажите дату окончания",
          validate: (value) => {
            const startDate = getValues("public_date_time");

            if (!startDate || !value) return true;

            return (
              dayjs(value).isAfter(dayjs(startDate)) ||
              "Дата окончания должна быть позже даты начала"
            );
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={field.value}
            label="Дата окончания"
            type="date"
            error={fieldState?.error}
            helperText={fieldState?.error?.message}
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
    </>
  );
};

export default ChooseLeadStep;
