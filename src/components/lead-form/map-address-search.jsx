import { useEffect, useRef, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import CustomSelect from "../../shared/ui/input/custom-select";
import { searchMapAddresses } from "./api/address-search.api";

export default function MapAddressSearch({ city, onSelect }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function handleSearch() {
    if (!city || query.trim().length < 3 || loading) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setError(false);
    setHasSearched(false);
    setResults([]);
    setSelectedId("");

    try {
      const addresses = await searchMapAddresses(query, {
        city: t(`lead_form.map_cities.${city.id}`),
        language: i18n.resolvedLanguage,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setResults(addresses);
      setHasSearched(true);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  function handleQueryChange(event) {
    requestRef.current?.abort();
    setQuery(event.target.value);
    setLoading(false);
    setError(false);
    setHasSearched(false);
    setResults([]);
    setSelectedId("");
  }

  return (
    <Box sx={{ flex: 1, minWidth: { xs: 0, sm: 280 } }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <TextField
          id="lead-map-address-query"
          fullWidth
          size="small"
          label={t("lead_form.map_address")}
          placeholder={t("lead_form.map_address_placeholder")}
          value={query}
          disabled={!city}
          error={error}
          onChange={handleQueryChange}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) {
              event.preventDefault();
              handleSearch();
            }
          }}
          helperText={error
            ? t("lead_form.map_address_search_failed")
            : t(city ? "lead_form.map_address_search_hint" : "lead_form.map_address_city_required")}
          sx={{ "& .MuiOutlinedInput-root": { minHeight: 42, borderRadius: 2.5, backgroundColor: "#fff" } }}
        />
        <Button
          type="button"
          variant="outlined"
          loading={loading}
          disabled={!city || query.trim().length < 3}
          onClick={handleSearch}
          sx={{ minHeight: 42, borderRadius: 2.5 }}
        >
          {t("ui.find")}
        </Button>
      </Stack>

      {hasSearched && (
        <CustomSelect
          id="lead-map-address-result"
          fullWidth
          label={t("lead_form.map_address_results")}
          value={selectedId}
          disabled={!results.length}
          options={[
            { value: "", label: t("lead_form.map_address_choose") },
            ...results.map((result) => ({ value: result.id, label: result.label })),
          ]}
          onChange={(event) => {
            setSelectedId(event.target.value);
            const address = results.find((result) => result.id === event.target.value);
            if (address) onSelect({ center: address.center, zoom: address.zoom });
          }}
          helperText={t(results.length ? "lead_form.map_address_hint" : "lead_form.map_address_not_found")}
          sx={{ mt: 1 }}
        />
      )}
    </Box>
  );
}
