import { useTranslation } from "react-i18next";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useForm, useWatch } from "react-hook-form";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
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
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedLead, setSelectedLead] = useState();
  const [selectedFactor, setSelectedFactor] = useState();

  const getFactors = useFactoringStore((state) => state.getFactors);
  const createFactoring = useFactoringStore((state) => state.createFactoring);
  const isCreateLoading = useFactoringStore((state) => state.isCreateLoading);
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
          {t("ui.create_factoring_heading")}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.9rem",
            fontWeight: "400",
          }}
        >
          {t("ui.create_factoring_description")}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {canBeSubmitted && (
          <Alert severity="error" sx={{ my: 1 }}>
            {t("ui.factoring_line_pending_creation_blocked")}
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
            {isFirstStep ? t("ui.cancel") : t("ui.back")}
          </Button>
          <Button
            variant="contained"
            disabled={canBeSubmitted || isCreateLoading}
            color="primary"
            onClick={isLast || !isSettingsExist ? handleSubmit : handleNextStep}
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            {isCreateLoading && (
              <CircularProgress
                size={15}
                sx={{
                  color: "white",
                }}
              />
            )}
            {isLast || !isSettingsExist ? t("ui.create") : t("ui.next")}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFactoringForm;
