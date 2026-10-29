import { useTranslation } from "react-i18next";
import { moneySpacingFormat } from "../../shared/helpers/money-spacing";
import CustomSelect from "../../shared/ui/input/custom-select";
import { CURRENCY_OPTIONS } from "../../shared/const/currencies";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import Section from "../../components/tenders/tender-section";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { useState } from "react";
import ConfirmModal from "../../shared/ui/confirm-modal";

const defaultValues = {
  amount: "",
  currency: "KZT",
  comment: "",
};

const MakeBetForm = ({ tender, handleHideBetField }) => {
  const { t } = useTranslation();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const makeBet = useTendersStore((state) => state.makeBet);
  const isBetsLoading = useTendersStore((state) => state.isBetsLoading);
  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );

  const {
    control,
    formState: { isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const submitBetForm = async () => {
    await makeBet(tender.id, formValues);

    handleHideBetField();

    await getCustomerTenderDetails(tender.id);
  };

  return (
    <Section
      title={t("ui.new_bid")}
      icon={<PaidOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 2fr) minmax(0, 1fr)" },
          gap: 2,
        }}
      >
        <Controller
          name="amount"
          rules={{
            required: t("ui.enter_bid_amount"),
            min: {
              value: 1,
              message: t("ui.amount_must_be_positive"),
            },
          }}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={t("ui.bid_amount")}
              size="small"
              type="number"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="currency"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <CustomSelect
              {...field}
              inputRef={ref}
              label={t("ui.currency")}
              fullWidth
              options={CURRENCY_OPTIONS}
            />
          )}
        />

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t("ui.comment")}
              fullWidth
              multiline
              minRows={3}
              size="small"
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                },
              }}
            />
          )}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
          py: 2,
        }}
      >
        <Button
          disabled={!isValid || isBetsLoading}
          variant="contained"
          disableElevation
          color="primary"
          onClick={handleOpenConfirmModal}
        >{t("ui.place_bid")}</Button>

        <Button variant="outlined" color="primary" onClick={handleHideBetField}>{t("ui.cancel")}</Button>
      </Box>

      <ConfirmModal
        title={t("ui.bid_confirmation")}
        description={
          <>
            <Typography>{t("ui.place_bid_confirmation")}</Typography>
            <Typography>{t("ui.amount_value", { value1: moneySpacingFormat(formValues.amount), value2: formValues.currency })}</Typography>
          </>
        }
        open={openConfirmModal}
        onCancel={handleCloseConfirmModal}
        onConfirm={submitBetForm}
        isLoading={isBetsLoading}
      />
    </Section>
  );
};

export default MakeBetForm;
