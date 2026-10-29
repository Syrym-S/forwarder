import appI18n from "../../../i18n/index.js";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { getTNVEDApi } from "../../../app/store/options/api";
import { useController } from "react-hook-form";
import { Alert, Autocomplete, Box, Button, TextField } from "@mui/material";

const levels = [
  { get label() { return appI18n.t("lead_form.select_commodity_section"); }, children: "groups" },
  { get label() { return appI18n.t("lead_form.select_commodity_chapter"); }, children: "positions" },
  { get label() { return appI18n.t("lead_form.select_commodity_heading"); }, children: "subpositions" },
  { get label() { return appI18n.t("lead_form.select_commodity_subheading"); }, children: "codes" },
];
const optionLabel = (option) => option.back ? option.name : `${option.code} — ${option.name}`;

export default function CargoTnvedField({ control, index, sections, loading, error, onRetry, disabled = false }) {
  const { t } = useTranslation();
  const [chosenPath, setChosenPath] = useState(null);
  const [query, setQuery] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (disabled || search === null) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const response = await getTNVEDApi(search.trim() ? { q: search.trim() } : {});
        const data = response.data;
        const items = Array.isArray(data) ? data : data?.results ?? data?.items ?? data?.data ?? [];
        if (!cancelled) setSearchResult({ query: search, items });
      } catch (failure) {
        if (!cancelled) setSearchError(failure.message || appI18n.t("lead_form.commodity_search_failed"));
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [search, disabled, retry]);
  const displayedSections = searchResult?.query === search ? searchResult.items : sections;
  const codes = useMemo(() => {
    const result = [];
    function visit(items, path = []) {
      for (const item of items) {
        if (path.length === levels.length || /^\d{10}$/.test(String(item.code))) {
          result.push({ ...item, path });
        } else {
          visit(item[levels[path.length].children] ?? [], [...path, item]);
        }
      }
    }
    visit(displayedSections);
    return result;
  }, [displayedSections]);
  const { field, fieldState } = useController({
    control,
    name: `cargos.${index}.tnved_code`,
    defaultValue: "",
    rules: {
      validate: (value) => {
        if (disabled) return true;
        if (!value) {
          return (!query && !chosenPath?.length) || t("lead_form.select_complete_commodity_code");
        }
        return selectedCode?.code === value || codes.some((item) => item.code === value) || t("lead_form.select_code_from_directory");
      },
    },
  });
  const value = String(field.value ?? "");
  const match = codes.find((item) => item.code === value) ?? (selectedCode?.code === value ? selectedCode : null);
  const path = chosenPath ?? match?.path ?? [];
  const inputValue = query ?? value;
  const normalizedInput = inputValue.replace(/\s/g, "");
  const isFullCode = /^\d{10}$/.test(normalizedInput);
  const childOptions = path.length
    ? path[path.length - 1][levels[path.length - 1].children] ?? []
    : displayedSections;
  const options = isFullCode ? codes : childOptions;
  const backOption = { back: true, code: "back", name: t("lead_form.up_one_level") };

  function clearSelection() {
    setChosenPath(null);
    setQuery("");
    setSearch("");
    setSelectedCode(null);
    field.onChange("");
  }

  return (
    <Box sx={{ gridColumn: "1 / -1" }}>
      {(searchError || error) && !disabled && (
        <Alert severity="error" sx={{ mb: 1 }} action={<Button onClick={() => { if (search !== null) setRetry((value) => value + 1); else onRetry(); }}>{t("ui.retry")}</Button>}>
          {searchError || error}
        </Alert>
      )}
      <Autocomplete
        disabled={disabled}
        open={open && !disabled}
        onOpen={() => setOpen(true)}
        onClose={(_, reason) => { if (reason !== "selectOption") setOpen(false); }}
        disableCloseOnSelect
        clearOnBlur={false}
        options={path.length ? [backOption, ...options] : options}
        value={match ?? null}
        inputValue={inputValue}
        loading={loading || searchLoading}
        loadingText={t("lead_form.loading_directory")}
        noOptionsText={t("lead_form.code_not_found")}
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, selected) => option.code === selected.code}
        filterOptions={(items) => items}
        onInputChange={(_, input, reason) => {
          if (reason === "input") {
            const code = input.replace(/\s/g, "");
            setQuery(input);
            setSearch(input);
            setChosenPath(null);
            const found = codes.find((item) => item.code === code);
            field.onChange(found?.code ?? "");
            if (found) setChosenPath(found.path);
            setOpen(true);
          } else if (reason === "clear") {
            clearSelection();
          }
        }}
        onChange={(_, selected) => {
          if (!selected) {
            clearSelection();
            return;
          }
          if (selected.back) {
            setChosenPath(path.slice(0, -1));
            setQuery("");
            field.onChange("");
            setOpen(true);
            return;
          }
          const finalCode = /^\d{10}$/.test(String(selected.code))
            ? codes.find((item) => item.code === selected.code)
            : path.length === levels.length
              ? codes.find((item) => item.code === selected.code)
              : null;
          if (finalCode) {
            setSelectedCode(finalCode);
            setChosenPath(finalCode.path);
            setQuery(null);
            field.onChange(finalCode.code);
            setOpen(false);
          } else {
            setChosenPath([...path, selected]);
            setQuery("");
            field.onChange("");
            setOpen(true);
          }
        }}
        onBlur={field.onBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={field.ref}
            name={field.name}
            label={t("lead_form.commodity_code")}
            placeholder={levels[path.length]?.label ?? t("lead_form.select_full_ten_digit_code")}
            size="small"
            error={!disabled && !!fieldState.error}
            helperText={disabled ? t("lead_form.commodity_code_international_only") : fieldState.error?.message ?? (
              isFullCode && !match && !loading && !error
                ? t("lead_form.code_not_found_in_directory")
                : [path.map((item) => item.code).join(" → "), match?.name ?? t("lead_form.select_next_level_or_full_code")].filter(Boolean).join(" · ")
            )}
          />
        )}
      />
    </Box>
  );
}
