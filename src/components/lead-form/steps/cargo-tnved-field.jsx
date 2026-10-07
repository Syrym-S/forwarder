import { useEffect, useMemo, useState } from "react";
import { getTNVEDApi } from "../../../app/store/options/api";
import { useController } from "react-hook-form";
import { Alert, Autocomplete, Box, Button, TextField } from "@mui/material";

const levels = [
  { label: "Выберите раздел (римские цифры)", children: "groups" },
  { label: "Выберите группу (2 цифры)", children: "positions" },
  { label: "Выберите позицию (4 цифры)", children: "subpositions" },
  { label: "Выберите субпозицию (6 цифр)", children: "codes" },
];
const optionLabel = (option) => option.back ? option.name : `${option.code} — ${option.name}`;

export default function CargoTnvedField({ control, index, sections, loading, error, onRetry, disabled = false }) {
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
        if (!cancelled) setSearchError(failure.message || "Не удалось выполнить поиск ТН ВЭД");
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
          return (!query && !chosenPath?.length) || "Выберите полный код из последнего уровня справочника";
        }
        return selectedCode?.code === value || codes.some((item) => item.code === value) || "Выберите код из справочника";
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
  const backOption = { back: true, code: "back", name: "← На уровень выше" };

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
        <Alert severity="error" sx={{ mb: 1 }} action={<Button onClick={() => { if (search !== null) setRetry((value) => value + 1); else onRetry(); }}>Повторить</Button>}>
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
        loadingText="Загрузка справочника..."
        noOptionsText="Код не найден"
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
            label="Код ТН ВЭД"
            placeholder={levels[path.length]?.label ?? "Выберите полный код (10 цифр)"}
            size="small"
            error={!disabled && !!fieldState.error}
            helperText={disabled ? "ТН ВЭД доступен только для международной перевозки" : fieldState.error?.message ?? (
              isFullCode && !match && !loading && !error
                ? "Код не найден в справочнике"
                : [path.map((item) => item.code).join(" → "), match?.name ?? "Выберите следующий уровень или введите полный код"].filter(Boolean).join(" · ")
            )}
          />
        )}
      />
    </Box>
  );
}
