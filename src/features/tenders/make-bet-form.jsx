import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";

const defaultValues = {
  amount: "",
  currrency: "",
  comment: "",
};

const MakeBetForm = ({ tender, showBetField, handleHideBetField }) => {
  const makeBet = useTendersStore((state) => state.makeBet);
  const getCustomerTenderDetails = useTendersStore(
    (state) => state.getCustomerTenderDetails,
  );

  const { control } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  const submitBetForm = async () => {
    await makeBet(tender.id, formValues);
    await getCustomerTenderDetails(tender.id);
  };

  return (
    <Dialog
      open={showBetField}
      onClose={handleHideBetField}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Сделайте вашу ставку</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "10px",
          }}
        >
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="$"
                size="small"
                type="number"
                fullWidth
              />
            )}
          />

          <Controller
            defaultValue={"KZT"}
            name="currency"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Валюта"
                fullWidth
                size="small"
              >
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
          <Button variant="outlined" color="primary" onClick={submitBetForm}>
            Сделать ставку
          </Button>

          <Button variant="outlined" color="error" onClick={handleHideBetField}>
            Отмена
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MakeBetForm;
