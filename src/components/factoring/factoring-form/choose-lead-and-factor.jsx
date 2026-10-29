import { useTranslation } from "react-i18next";
import CustomSelect from "../../../shared/ui/input/custom-select";
import { CURRENCY_OPTIONS } from "../../../shared/const/currencies";
import { useEffect, useState } from "react";
import { useFactoringStore } from "../../../app/store/factoring/factoring-store";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import RenderLeadOptions from "../../tenders/render-lead-options";
import RenderFactorOptions from "../../tenders/render-factor-options";

const ChooseLeadAndFactor = ({
  control,
  selectedLead,
  setSelectedLead,
  selectedFactor,
  setSelectedFactor,
  setValue,
}) => {
  const { t } = useTranslation();
  const [inputValueLead, setInputValueLead] = useState("");
  const [inputValueFactor, setInputValueFactor] = useState("");

  const isLeadLoading = useLeadsStore((state) => state.isLoading);
  const isFactorsLoading = useFactoringStore((state) => state.isFactorsLoading);
  const factors = useFactoringStore((state) => state.factors);
  const isSearchLoading = useLeadsStore((state) => state.isSearchLoading);
  const currentLead = useLeadsStore((state) => state.currentLead);
  const finishedLeads = useFactoringStore((state) => state.finishedLeads);
  const searchFinishedLeads = useFactoringStore(
    (state) => state.searchFinishedLeads,
  );

  useEffect(() => {
    if (!inputValueLead || inputValueLead.length < 2) return;

    const timer = setTimeout(async () => {
      await searchFinishedLeads({
        q: inputValueLead.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValueLead]);

  useEffect(() => {
    searchFinishedLeads({
      q: "Алматы",
    });
  }, []);

  return (
    <>
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
            required: t("ui.lead_selection_required"),
          }}
          render={({ field, fieldState }) => (
            <Autocomplete
              value={selectedLead}
              inputValue={inputValueLead}
              loading={isSearchLoading}
              options={finishedLeads}
              noOptionsText={<>{t("ui.enter_two_characters")}</>}
              onInputChange={(_, value, reason) => {
                if (reason === "input") {
                  setInputValueLead(value);
                }

                if (reason === "clear") {
                  setInputValueLead("");
                }
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
                setInputValueLead(
                  value?.from ? `${value?.from} - ${value?.to}` : "",
                );
              }}
              getOptionLabel={(option) => `${option?.from} - ${option?.to}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("ui.lead")}
                  placeholder={t("ui.select_lead")}
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error
                      ? fieldState.error?.message
                      : t("ui.search_by_city")
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
          rules={{
            required: t("ui.factor_selection_required"),
          }}
          render={({ field, fieldState }) => (
            <Autocomplete
              value={selectedFactor}
              inputValue={inputValueFactor}
              loading={isFactorsLoading}
              options={factors}
              noOptionsText={<>{t("ui.enter_two_characters")}</>}
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
                t("ui.person_company_option", { value1: option?.fio, value2: option?.company_name })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("ui.factor")}
                  placeholder={t("ui.factor_selection")}
                  error={!!fieldState.error}
                  helperText={
                    fieldState.error
                      ? fieldState.error?.message
                      : t("ui.bin_iin_search_hint")
                  }
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
            gridTemplateColumns: {
              xs: "2fr 1fr",
              sm: "3fr 1fr",
            },
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
                label={t("ui.accounts_receivable_amount")}
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
            render={({ field: { ref, ...field } }) => (
              <CustomSelect
                {...field}
                inputRef={ref}
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
                label={t("ui.currency")}
                fullWidth
                size="small"
                options={CURRENCY_OPTIONS}
              />
            )}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChooseLeadAndFactor;
