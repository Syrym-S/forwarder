import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StepSection } from "../step-section";
import { InfoBadge } from "../info-badge";
import { useCustomerStore } from "../../../app/store/customers/customers-store";
import { useEffect, useState } from "react";

const hasCustomer = (customer) =>
  Boolean(customer?.id || customer?.name?.trim());

const CustomerStep = ({ control, errors, setValue }) => {
  const { t } = useTranslation();
  const selectedCustomer = useWatch({
    control,
    name: "customer",
  });

  const [inputValue, setInputValue] = useState("");

  const customers = useCustomerStore((state) => state.customers);
  const getCustomers = useCustomerStore((state) => state.getCustomers);
  const searchCustomers = useCustomerStore((state) => state.searchCustomers);
  const isLoading = useCustomerStore((state) => state.isLoading);

  useEffect(() => {
    const value = inputValue.trim();

    const timer = setTimeout(() => {
      if (!value) {
        getCustomers();
        return;
      }

      if (value.length >= 1) {
        searchCustomers({ q: value });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, getCustomers, searchCustomers]);

  return (
    <StepSection
      title={t("lead_form.customer_selection")}
      description={t("lead_form.select_customer_description")}
    >
      <Controller
        name="customer"
        control={control}
        render={({ field }) => (
          <Stack spacing={2}>
            <Autocomplete
              inputValue={inputValue}
              options={customers}
              filterOptions={(options) => options}
              value={hasCustomer(field.value) ? field.value : null}
              getOptionLabel={(option) => option?.name || t("lead_form.untitled")}
              loading={isLoading}
              isOptionEqualToValue={(option, value) =>
                option === value ||
                (Boolean(option?.id) && Boolean(value?.id) &&
                  String(option.id) === String(value.id))
              }
              renderValue={(value) => {
                if (!hasCustomer(value)) return null;

                return (
                  <Chip
                    variant="filled"
                    color="primary"
                    label={value.name || t("lead_form.untitled")}
                  />
                );
              }}
              onInputChange={(_, newInputValue, reason) => {
                if (reason === "input") {
                  setInputValue(newInputValue);
                }

                if (reason === "clear") {
                  setInputValue("");
                }
              }}
              onChange={(_, value) => {
                field.onChange(value);

                setInputValue("");

                setValue("customer", value, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              }}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    px: "16px !important",
                    py: "10px !important",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    display: "flex !important",
                    flexDirection: "column !important",
                    alignItems: "flex-start !important",
                    gap: "5px !important",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.3,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {option.name || t("lead_form.untitled")}
                    </Typography>
                    {option.type && (
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "primary.main",
                          bgcolor: "primary.50",
                          borderRadius: 1,
                          px: 0.75,
                          py: 0.2,
                        }}
                      >
                        {option.type}
                      </Typography>
                    )}
                  </Box>
                  {option.bin && (
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                      }}
                    >{t("lead_form.bin_label")}{" "}
                      <Box
                        component="span"
                        sx={{ color: "text.primary", fontWeight: 500 }}
                      >
                        {option.bin}
                      </Box>
                    </Typography>
                  )}
                  {option.persons?.map((person, index) =>
                    person && (person.fio || person.iin || person.phone || person.email) ? (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 2,
                        }}
                      >
                        {person.fio && (
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary", overflowWrap: "anywhere" }}
                          >
                            {person.fio}
                          </Typography>
                        )}
                        {person.iin && (
                          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t("ui.iin_label")}{" "}
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {person.iin}
                            </Box>
                          </Typography>
                        )}
                        {person.phone && (
                          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t("ui.phone_label")}{" "}
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
                              +{String(person.phone).replace(/^\+/, "")}
                            </Box>
                          </Typography>
                        )}
                        {person.email && (
                          <Typography
                            sx={{ fontSize: 12, color: "text.secondary", overflowWrap: "anywhere" }}
                          >
                            Email:{" "}
                            <Box component="span" sx={{ color: "text.primary", fontWeight: 500 }}>
                              {person.email}
                            </Box>
                          </Typography>
                        )}
                      </Box>
                    ) : null,
                  )}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("lead_form.select_customer")}
                  error={Boolean(errors.customer)}
                  helperText={errors.customer?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              )}
            />

            {hasCustomer(selectedCustomer) && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                <InfoBadge label={t("ui.customer")} value={selectedCustomer.name} />

                <InfoBadge label={t("ui.company_type")} value={selectedCustomer.type} />
              </Box>
            )}
          </Stack>
        )}
      />
    </StepSection>
  );
};

export default CustomerStep;
