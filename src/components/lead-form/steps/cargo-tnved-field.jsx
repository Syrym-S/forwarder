import { useMemo, useState } from "react";
import { useController } from "react-hook-form";
import { Alert, Autocomplete, Box, Button, TextField } from "@mui/material";

const levels = [
  { label: "Выберите раздел (римские цифры)", children: "groups" },
  { label: "Выберите группу (2 цифры)", children: "positions" },
  { label: "Выберите позицию (4 цифры)", children: "subpositions" },
  { label: "Выберите субпозицию (6 цифр)", children: "codes" },
];
const optionLabel = (option) => option.back ? option.name : `${option.code} — ${option.name}`;

export default function CargoTnvedField({ control, index, sections, loading, error, onRetry }) {
  const [chosenPath, setChosenPath] = useState(null);
  const [query, setQuery] = useState(null);
  const [open, setOpen] = useState(false);
  const codes = useMemo(() => {
    const result = [];
    function visit(items, path = []) {
      for (const item of items) {
        if (path.length === levels.length) {
          result.push({ ...item, path });
        } else {
          visit(item[levels[path.length].children] ?? [], [...path, item]);
        }
      }
    }
    visit(sections);
    return result;
  }, [sections]);
  const { field, fieldState } = useController({
    control,
    name: `cargos.${index}.tnved_code`,
    defaultValue: "",
    rules: {
      validate: (value) => {
        if (!value) {
          return (!query && !chosenPath?.length) || "Выберите полный код из последнего уровня справочника";
        }
        return codes.some((item) => item.code === value) || "Выберите код из справочника";
      },
    },
  });
  const value = String(field.value ?? "");
  const match = codes.find((item) => item.code === value);
  const path = chosenPath ?? match?.path ?? [];
  const inputValue = query ?? value;
  const normalizedInput = inputValue.replace(/\s/g, "");
  const isFullCode = /^\d{10}$/.test(normalizedInput);
  const childOptions = path.length
    ? path[path.length - 1][levels[path.length - 1].children] ?? []
    : sections;
  const options = isFullCode ? codes : childOptions;
  const backOption = { back: true, code: "back", name: "← На уровень выше" };

  function clearSelection() {
    setChosenPath(null);
    setQuery("");
    field.onChange("");
  }

  return (
    <Box sx={{ gridColumn: "1 / -1" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }} action={<Button onClick={onRetry}>Повторить</Button>}>
          {error}
        </Alert>
      )}
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={(_, reason) => { if (reason !== "selectOption") setOpen(false); }}
        disableCloseOnSelect
        clearOnBlur={false}
        options={path.length ? [backOption, ...options] : options}
        value={match ?? null}
        inputValue={inputValue}
        loading={loading}
        loadingText="Загрузка справочника..."
        noOptionsText="Код не найден"
        getOptionLabel={optionLabel}
        isOptionEqualToValue={(option, selected) => option.code === selected.code}
        filterOptions={(items, state) => {
          const search = state.inputValue.trim().toLocaleLowerCase("ru");
          return items.filter((item) => item.back || String(item.code).includes(search) || item.name.toLocaleLowerCase("ru").includes(search));
        }}
        onInputChange={(_, input, reason) => {
          if (reason === "input") {
            const code = input.replace(/\s/g, "");
            setQuery(input);
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
          const finalCode = isFullCode
            ? codes.find((item) => item.code === selected.code)
            : path.length === levels.length
              ? codes.find((item) => item.code === selected.code)
              : null;
          if (finalCode) {
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
            error={!!fieldState.error}
            helperText={fieldState.error?.message ?? (
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
