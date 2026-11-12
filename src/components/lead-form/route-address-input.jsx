import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormInput from "../../shared/ui/input/form-input";
import { searchRouteAddresses } from "./api/route-address-search.api";

const emptySuggestions = {
  query: "",
  options: [],
  loading: false,
  error: false,
  searched: false,
};

function AddressInput({
  field,
  fieldState,
  label,
  disabled,
  center,
  onSelect,
  onEdit,
  onFocus,
}) {
  const { t, i18n } = useTranslation();
  const value = field.value || "";
  const [request, setRequest] = useState(null);
  const [suggestions, setSuggestions] = useState(emptySuggestions);
  const lat = center?.[0];
  const lon = center?.[1];
  const language = i18n.resolvedLanguage;

  useEffect(() => {
    if (!request || request.query !== value || disabled) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      searchRouteAddresses(request.query, {
        center: [lat, lon],
        language,
        signal: controller.signal,
      })
        .then((options) => {
          if (!controller.signal.aborted) {
            setSuggestions({
              query: request.query,
              options,
              loading: false,
              error: false,
              searched: true,
            });
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions({
              ...emptySuggestions,
              query: request.query,
              error: true,
            });
          }
        });
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [request, value, lat, lon, language, disabled]);

  const current = suggestions.query === value ? suggestions : emptySuggestions;
  const helperText =
    fieldState.error?.message ||
    t(
      current.error
        ? "addressAutocomplete.failed"
        : current.searched && !current.options.length
          ? "addressAutocomplete.empty"
          : "addressAutocomplete.hint",
    );

  return (
    <Autocomplete
      freeSolo
      fullWidth
      autoHighlight
      openOnFocus
      disabled={disabled}
      value={null}
      inputValue={value}
      options={current.options}
      filterOptions={(options) => options}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.label
      }
      getOptionKey={(option) =>
        typeof option === "string" ? option : option.id
      }
      loading={current.loading}
      loadingText={t("addressAutocomplete.loading")}
      clearText={t("addressAutocomplete.clear")}
      onFocus={onFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.nativeEvent.isComposing)
          event.preventDefault();
      }}
      onInputChange={(_, text, reason) => {
        if (reason !== "input" && reason !== "clear") return;
        field.onChange(text);
        onEdit();
        const shouldSearch = text.trim().length >= 3;
        setRequest(shouldSearch ? { query: text } : null);
        setSuggestions({
          ...emptySuggestions,
          query: text,
          loading: shouldSearch,
        });
      }}
      onChange={(_, address) => {
        if (!address || typeof address === "string") return;
        setRequest(null);
        setSuggestions(emptySuggestions);
        field.onChange(address.label);
        onSelect(address);
      }}
      renderInput={(params) => (
        <FormInput
          {...params}
          name={field.name}
          inputRef={field.ref}
          onBlur={field.onBlur}
          label={label}
          placeholder={t("addressAutocomplete.placeholder")}
          size="small"
          error={Boolean(fieldState.error) || current.error}
          helperText={helperText}
          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {current.loading && <CircularProgress size={16} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            htmlInput: { ...params.slotProps.htmlInput, autoComplete: "off" },
          }}
        />
      )}
      sx={{ minWidth: 0 }}
    />
  );
}

export default function RouteAddressInput({ name, control, rules, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <AddressInput field={field} fieldState={fieldState} {...props} />
      )}
    />
  );
}
