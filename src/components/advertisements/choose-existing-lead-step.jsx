import FormInput from "../../shared/ui/input/form-input";
import InfoItem from "../../shared/ui/info-item";
import RenderLeadOptions from "../tenders/render-lead-options";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Autocomplete,
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAdvertisementsStore } from "../../app/store/advertisements/advertisements-store";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";

const ChooseExistingLeadStep = ({ lead, onChange, disabled = false }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const leads = useAdvertisementsStore((state) => state.leads);
  const searchQuery = useAdvertisementsStore((state) => state.searchQuery);
  const isSearchLoading = useAdvertisementsStore((state) => state.isSearchLoading);
  const searchError = useAdvertisementsStore((state) => state.searchError);
  const searchLeads = useAdvertisementsStore((state) => state.searchLeads);
  const clearLeadSearch = useAdvertisementsStore((state) => state.clearLeadSearch);
  const shouldSearch = !disabled && query.length >= 2;
  const isLoading =
    shouldSearch && (searchQuery !== query || isSearchLoading);
  const hasSearchError =
    shouldSearch && searchQuery === query && Boolean(searchError);

  useEffect(() => {
    if (!shouldSearch) return;

    const timer = setTimeout(() => void searchLeads(query), 500);

    return () => {
      clearTimeout(timer);
      clearLeadSearch();
    };
  }, [query, shouldSearch, searchLeads, clearLeadSearch]);

  const getAddress = (location, fallback) =>
    location?.address ||
    location?.city ||
    fallback ||
    t("ui.address_not_specified");
  const getLeadLabel = (option) =>
    `${option.num || option.id} · ${getAddress(option.from_location, option.from)} — ${getAddress(option.to_location, option.to)}`;
  const hasPrice =
    lead?.price !== null && lead?.price !== undefined && lead?.price !== "";

  return (
    <Stack spacing={2.5}>
      <Autocomplete
        value={lead}
        clearOnBlur={false}
        disabled={disabled}
        options={shouldSearch && searchQuery === query ? leads : []}
        loading={isLoading}
        loadingText={t("ui.loading")}
        filterOptions={(options) => options}
        isOptionEqualToValue={(option, value) =>
          String(option.id) === String(value.id)
        }
        getOptionLabel={getLeadLabel}
        noOptionsText={
          shouldSearch
            ? t("advertisements.no_leads_found")
            : t("ui.enter_two_characters")
        }
        onInputChange={(_, value, reason) => {
          if (reason === "blur") return;
          setQuery(reason === "input" ? value.trim() : "");
        }}
        onChange={(_, value) => onChange(value)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 8px 24px rgba(22, 36, 62, 0.1)",
            },
          },
          listbox: { sx: { p: 0, maxHeight: 400 } },
        }}
        renderInput={(params) => (
          <FormInput
            {...params}
            label={t("ui.lead")}
            placeholder={t("advertisements.search_lead_hint")}
            error={hasSearchError}
            helperText={
              hasSearchError
                ? t("dashboard.loading_error")
                : t("advertisements.search_lead_hint")
            }
          />
        )}
        renderOption={({ key, ...props }, option) => (
          <RenderLeadOptions key={key} {...props} option={option} />
        )}
      />

      {lead && (
        <>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
            <Typography
              component="h3"
              sx={{ fontSize: 15, fontWeight: 600, mb: 1.5 }}
            >
              {t("ui.lead_data")}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "minmax(0, 1fr)",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1.5,
                "& .MuiTypography-root": { overflowWrap: "anywhere" },
              }}
            >
              <InfoItem
                label={t("ui.lead_number_column")}
                value={lead.num || lead.id}
              />
              <InfoItem
                label={t("ui.customer_price")}
                value={
                  hasPrice
                    ? `${moneySpacingFormat(lead.price)} ${lead.currency || "KZT"}`
                    : null
                }
              />
              <InfoItem
                label={t("ui.origin")}
                value={getAddress(lead.from_location, lead.from)}
              />
              <InfoItem
                label={t("ui.destination")}
                value={getAddress(lead.to_location, lead.to)}
              />
            </Box>
          </Paper>

        </>
      )}
    </Stack>
  );
};

export default ChooseExistingLeadStep;
