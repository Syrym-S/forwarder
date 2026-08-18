import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { Controller, useForm, useWatch } from "react-hook-form";
import RenderLeadOptions from "../../components/tenders/render-lead-options";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import RenderFactorOptions from "../../components/tenders/render-factor-options";
import ChooseLeadAndFactor from "../../components/factoring/factoring-form/choose-lead-and-factor";
import FactoringSettingsInfoStep from "../../components/factoring/factoring-form/factoring-settings-info-step";

const stepFields = ["lead_id", "factor_id", "debSumm"];

const defaultValues = {
  lead_id: "",
  factor_id: "",
  debSumm: "",
  currency: "KZT",
  debCurrency: "",
};

const CreateFactoringForm = ({ openFormModal, handleModalClose }) => {
  const [step, setStep] = useState(1);
  const [selectedLead, setSelectedLead] = useState();
  const [selectedFactor, setSelectedFactor] = useState();

  const getFactors = useFactoringStore((state) => state.getFactors);
  const createFactoring = useFactoringStore((state) => state.createFactoring);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const currentLead = useLeadsStore((state) => state.currentLead);

  const isSettingsExist = selectedFactor?.factor_setting;

  const approvedLine = selectedFactor?.lines?.find(
    (line) => line.status === "approved",
  );
  const newLine = selectedFactor?.lines?.find((line) => line.status === "new");
  const canBeSubmitted = !approvedLine && isSettingsExist;

  const { control, setValue, trigger, reset } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues,
  });

  const formValues = useWatch({ control });
  const isFirstStep = step === 1;
  const isLast = step === 2;

  const handleSubmit = async () => {
    const isValid = await trigger(stepFields);
    if (!isValid) return;

    await createFactoring(formValues);

    reset();
    setSelectedLead(null);
    setSelectedFactor(null);

    handleModalClose();

    await getFactorings();
  };

  const handleNextStep = async () => {
    const isValid = await trigger(stepFields);

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    if (selectedLead) {
      getLeadItem(selectedLead?.id);
    }
  }, [selectedLead]);

  useEffect(() => {
    if (!currentLead) return;

    setValue("debSumm", currentLead.price, {
      shouldDirty: true,
      shouldTouch: true,
    });

    setValue("debCurrency", currentLead.currency, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [currentLead, setValue]);

  useEffect(() => {
    getFactors();
  }, []);

  const renderFormStep = (step) => {
    switch (step) {
      case 1:
        return (
          <ChooseLeadAndFactor
            control={control}
            selectedLead={selectedLead}
            setSelectedLead={setSelectedLead}
            selectedFactor={selectedFactor}
            setSelectedFactor={setSelectedFactor}
            setValue={setValue}
          />
        );

      case 2:
        if (selectedFactor?.lines?.length && (approvedLine || newLine)) {
          return (
            <FactoringSettingsInfoStep
              line={approvedLine || newLine}
              approvedLine={approvedLine}
            />
          );
        }

        return null;

      default:
        return null;
    }
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
        },
      }}
      open={openFormModal}
      onClose={handleModalClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: "600",
          }}
        >
          Создание факторинга
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          Выберите завершённый лид, фактор и укажите параметры факторинга
        </Typography>
      </DialogTitle>

      <DialogContent>
        {canBeSubmitted && (
          <Alert severity="error" sx={{ my: 1 }}>
            Факторинг не может быть создан, так как линия ожидает подтверждения
          </Alert>
        )}
        {renderFormStep(step)}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            my: 1,
          }}
        >
          <Button
            variant="outlined"
            color="error"
            onClick={isFirstStep ? handleModalClose : handlePrevStep}
          >
            {isFirstStep ? "Отмена" : "Назад"}
          </Button>
          <Button
            variant="contained"
            disabled={canBeSubmitted}
            color="primary"
            onClick={isLast || !isSettingsExist ? handleSubmit : handleNextStep}
          >
            {isLast || !isSettingsExist ? "Cоздать" : "Дальше"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactoringForm;
