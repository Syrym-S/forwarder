import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import Section from "../../shared/ui/section";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { useState } from "react";
import ConfirmBetModal from "./confirm-actions/confirm-bet-modal";
import CancelBetModal from "./confirm-actions/cancel-bet-modal";

const defaultValues = {
  amount: "",
  currency: "KZT",
  comment: "",
};

const MakeBetForm = ({ tender, handleHideBetField }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const makeBet = useTendersStore((state) => state.makeBet);
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

  console.log(formValues);

  const handleOpenConfirmModal = () => {
    setOpenConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirmModal(false);
  };

  const submitBetForm = async () => {
    await makeBet(tender.id, formValues);
    await getCustomerTenderDetails(tender.id);
    handleHideBetField();
  };

  return (
    <Section
      title="Сделайте вашу ставку"
      icon={<PaidOutlinedIcon color="primary" />}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "10px",
        }}
      >
        <Controller
          name="amount"
          rules={{
            required: "Введите сумму ставки",
            min: {
              value: 1,
              message: "Сумма должна быть больше 0",
            },
          }}
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="$"
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
          render={({ field }) => (
            <TextField {...field} select label="Валюта" fullWidth size="small">
              <MenuItem value="KZT">KZT</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="RUB">RUB</MenuItem>
            </TextField>
          )}
        />

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Комментарий"
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
          py: 2,
        }}
      >
        <Button
          disabled={!isValid}
          variant="outlined"
          color="primary"
          onClick={handleOpenConfirmModal}
        >
          Сделать ставку
        </Button>

        <Button variant="outlined" color="error" onClick={handleHideBetField}>
          Отмена
        </Button>
      </Box>

      <ConfirmBetModal
        handleCloseConfirmModal={handleCloseConfirmModal}
        openConfirmModal={openConfirmModal}
        formValues={formValues}
        submitBetForm={submitBetForm}
      />
    </Section>
  );
};

export default MakeBetForm;
