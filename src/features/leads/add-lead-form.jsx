import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { act, useEffect, useState } from "react";
import FormHeader from "../../components/lead-form/form-header";
import FormStepsTab from "../../components/lead-form/form-steps-tab";
import FirstStep from "../../components/lead-form/steps/first-step";
import { FormNavButtons } from "../../components/lead-form/form-nav-buttons";
import { useForm, useWatch } from "react-hook-form";
import { SecondStep } from "../../components/lead-form/steps/second-step";
import { LastStep } from "../../components/lead-form/steps/last-step";
import { CreateLeadResultModal } from "../../components/lead-form/create-lead-result-modal";
import {
  mapCreatedLeadToUi,
  mapCreateLeadFormToApi,
} from "../../components/lead-form/model/createLead.adapter";
import { useLeadsStore } from "../../app/store/leads-store";
import { ThirdStep } from "../../components/lead-form/steps/third-step";
import { ForthStep } from "../../components/lead-form/steps/forth-step";

const steps = ["Маршрут", "Груз", "Водитель", "Заказщик", "Проверка"];

const stepFields = [
  ["fromLocation", "toLocation", "loadingDate"],
  [
    "cargoType",
    "weightKg",
    "cargoLengthCm",
    "cargoWidthCm",
    "cargoHeightCm",
    "price",
    "currency",
  ],
  ["forwarderId"],
];

const AddLeadForm = ({
  editingItemId = null,
  isEdit = false,
  openForm,
  setOpenForm,
  defaultValues = {},
}) => {
  const createLead = useLeadsStore((state) => state.createLead);
  const updateLead = useLeadsStore((state) => state.updateLead);
  const [maxAvailableStep, setMaxAvailableStep] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: null,
    title: "",
    message: "",
  });

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // useEffect(() => {
  //   reset(defaultValues);
  // }, [defaultValues, reset]);

  const formValues = useWatch({ control });

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  async function handleCreateRoute(data) {
    try {
      setIsSubmitting(true);

      const payload = mapCreateLeadFormToApi(data);

      // const createdLead = mapCreatedLeadToUi(data);

      if (isEdit) {
        await updateLead(editingItemId, payload);
      } else {
        await createLead(payload);
      }

      // prependLead(createdLead);

      handleClose();

      setResultModal({
        open: true,
        type: "success",
        title: isEdit ? "Перевозка отредактирована" : "Перевозка создана",
        message: `Лид успешно ${isEdit ? "изменён" : "создан"} ${data?.id ? `: ${response.id}` : ""}`,
      });
    } catch (error) {
      setResultModal({
        open: true,
        type: "error",
        title: "Ошибка создания",
        message:
          error.response?.data?.message ||
          error.message ||
          "Не удалось создать перевозку",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitClick() {
    if (!isLastStep) {
      return;
    }

    await handleSubmit(handleCreateRoute)();
  }

  const renderContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FirstStep
            control={control}
            errors={errors}
            form={formValues}
            setValue={setValue}
          />
        );
      case 1:
        return (
          <SecondStep
            control={control}
            errors={errors}
            form={formValues}
            setValue={setValue}
          />
        );
      case 2:
        return (
          <ThirdStep control={control} errors={errors} setValue={setValue} />
        );
      case 3:
        return (
          <ForthStep control={control} errors={errors} setValue={setValue} />
        );
      case 4:
        return <LastStep form={formValues} />;
    }
  };

  function handleClose() {
    setActiveStep(0);
    setMaxAvailableStep(0);
    reset(defaultValues);
    setOpenForm(false);
  }

  function handleBack() {
    setActiveStep((prevStep) => prevStep - 1);
  }

  async function handleNext() {
    const fields = stepFields[activeStep] || [];

    const isStepValid = await trigger(fields);

    if (!isStepValid) {
      return;
    }

    const nextStep = activeStep + 1;

    setMaxAvailableStep((prevStep) => Math.max(prevStep, nextStep));
    setActiveStep(nextStep);
  }

  return (
    <>
      <Dialog open={openForm} maxWidth="md" fullWidth>
        <FormHeader
          isEdit={isEdit}
          activeStep={activeStep}
          stepsCount={steps.length}
        />
        <DialogContent sx={{ px: 3 }}>
          <FormStepsTab steps={steps} activeStep={activeStep} />

          {renderContent(activeStep)}

          <FormNavButtons
            isEdit={isEdit}
            isFirstStep={activeStep === 0}
            isLastStep={activeStep + 1 === steps.length}
            hasCurrentStepErrors={false}
            isSubmitting={false}
            onClose={handleClose}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmitClick}
          />
        </DialogContent>
      </Dialog>

      <CreateLeadResultModal
        open={resultModal.open}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() =>
          setResultModal({
            open: false,
            type: null,
            title: "",
            message: "",
          })
        }
      />
    </>
  );
};

export default AddLeadForm;
