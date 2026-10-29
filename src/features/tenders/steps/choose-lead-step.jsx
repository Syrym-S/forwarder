import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Controller, useWatch } from "react-hook-form";
import { Autocomplete, Box } from "@mui/material";
import RenderLeadOptions from "../../../components/tenders/render-lead-options";
import { STATUS } from "../../../shared/const/tenders";
import FormInput from "../../../shared/ui/input/form-input";
import FormControllerInput from "../../../shared/ui/input/form-controller-input";
import { useTendersStore } from "../../../app/store/tenders/tender-store";
import { isDraftLead } from "../../../shared/lib/lead-draft";

const ChooseLeadStep = ({ control, setValue, isEdit }) => {
  const { t } = useTranslation();
  const searchLeadsWithoutDriver = useTendersStore(
    (state) => state.searchLeadsWithoutDriver,
  );
  const isSearchLoading = useTendersStore((state) => state.isSearchLoading);
  const leadsWithoutDriver = useTendersStore(
    (state) => state.leadsWithoutDriver,
  );

  const [inputValue, setInputValue] = useState("");
  const [selectedLead, setSelectedLead] = useState();

  // Дата и время публикации
  const publicDate = useWatch({
    control,
    name: "public_date",
  });

  const publicTime = useWatch({
    control,
    name: "public_time",
  });

  // Дата и время окончания
  const endDate = useWatch({
    control,
    name: "end_date",
  });

  const endTime = useWatch({
    control,
    name: "end_time",
  });

  useEffect(() => {
    if (!inputValue) return;

    const timer = setTimeout(async () => {
      await searchLeadsWithoutDriver({
        q: inputValue.trim(),
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [inputValue, searchLeadsWithoutDriver]);

  useEffect(() => {
    if (!publicDate || !publicTime) {
      setValue("public_date_time", "");
      return;
    }

    setValue("public_date_time", `${publicDate} ${publicTime}:00`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [publicDate, publicTime, setValue]);

  useEffect(() => {
    if (!endDate || !endTime) {
      setValue("end_date_time", "");
      return;
    }

    setValue("end_date_time", `${endDate} ${endTime}:00`, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [endDate, endTime, setValue]);

  return (
    <>
      <Controller
        name="lead"
        control={control}
        rules={{
          required: t("ui.lead_selection_required"),
          validate: (value) => {
            if (isDraftLead(value)) return t("ui.draft_auction_not_allowed");
            return value?.status === STATUS.new ||
              t("ui.select_lead_without_driver");
          },
        }}
        render={({ field, fieldState }) => (
          <Autocomplete
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
            value={selectedLead}
            inputValue={inputValue}
            loading={isSearchLoading}
            disabled={isEdit}
            options={isSearchLoading ? [] : leadsWithoutDriver.filter((lead) => !isDraftLead(lead))}
            noOptionsText={t("ui.enter_two_characters")}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input") {
                setInputValue(newInputValue);
              }

              if (reason === "clear") {
                setInputValue("");
              }
            }}
            filterOptions={(items) => items}
            onChange={(_, value) => {
              field.onChange(value);

              setInputValue(value?.from ? `${value.from} - ${value.to}` : "");

              setValue("lead", value, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });

              setSelectedLead(value);
            }}
            getOptionLabel={(option) => `${option?.from} - ${option?.to}`}
            renderInput={(params) => (
              <FormInput
                {...params}
                label={t("ui.lead")}
                placeholder={t("ui.select_lead")}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
            renderOption={(props, option) => (
              <RenderLeadOptions {...props} key={option.id} option={option} />
            )}
          />
        )}
      />

      {/* ================= PUBLICATION ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 1fr",
          },
          gap: 1,
          mt: 1.5,
        }}
      >
        {/* Дата публикации */}

        <FormControllerInput
          name="public_date"
          control={control}
          rules={{
            required: t("ui.select_publication_date"),

            validate: (value) => {
              if (!value) return true;

              return (
                !dayjs(value).isBefore(dayjs(), "day") ||
                t("ui.date_cannot_be_before_today")
              );
            },
          }}
          label={t("ui.publication_date")}
          type="date"
          onChange={(event) => {
            if (!event.target.value) return;
            setValue("public_time", dayjs().format("HH:mm"), {
              shouldDirty: true,
            });
          }}
          fullWidth
          slotProps={{
            htmlInput: {
              min: dayjs().format("YYYY-MM-DD"),
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />

        {/* Время публикации */}

        <FormControllerInput
          name="public_time"
          control={control}
          rules={{
            required: t("ui.enter_publication_time"),

            validate: (value) => {
              if (!value || !publicDate) return true;

              // Проверяем время только если выбран сегодняшний день
              if (!dayjs(publicDate).isSame(dayjs(), "day")) {
                return true;
              }

              const selectedDateTime = dayjs(`${publicDate} ${value}`);

              return (
                !selectedDateTime.isBefore(dayjs(), "minute") ||
                t("ui.time_cannot_be_in_past")
              );
            },
          }}
          label={t("ui.time")}
          type="time"
          fullWidth
          slotProps={{
            htmlInput: {
              step: 60,
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>

      {/* ================= END ================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "2fr 1fr",
          },
          gap: 1,
          mt: 1.5,
        }}
      >
        {/* Дата окончания */}

        <FormControllerInput
          name="end_date"
          control={control}
          rules={{
            required: t("ui.enter_end_date"),

            validate: (value) => {
              if (!value || !publicDate) return true;

              return (
                !dayjs(value).isBefore(dayjs(publicDate), "day") ||
                t("ui.end_date_before_publication")
              );
            },
          }}
          label={t("ui.end_date")}
          type="date"
          onChange={(event) => {
            if (!event.target.value) return;
            setValue("end_time", dayjs().format("HH:mm"), {
              shouldDirty: true,
            });
          }}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },

            htmlInput: {
              min: publicDate || dayjs().format("YYYY-MM-DD"),
            },
          }}
        />

        {/* Время окончания */}

        <FormControllerInput
          name="end_time"
          control={control}
          rules={{
            required: t("ui.enter_end_time"),

            validate: (value) => {
              if (!value || !endDate || !publicDate || !publicTime) {
                return true;
              }

              const publicationDateTime = dayjs(`${publicDate} ${publicTime}`);

              const endDateTime = dayjs(`${endDate} ${value}`);

              return (
                endDateTime.isAfter(publicationDateTime) ||
                t("ui.end_datetime_after_publication")
              );
            },
          }}
          label={t("ui.time")}
          type="time"
          fullWidth
          slotProps={{
            htmlInput: {
              step: 60,
            },
            inputLabel: {
              shrink: true,
            },
          }}
        />
      </Box>
    </>
  );
};

export default ChooseLeadStep;
