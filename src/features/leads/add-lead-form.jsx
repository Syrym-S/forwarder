import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormHeader from "../../components/lead-form/form-header";
import FormStepsTab from "../../components/lead-form/form-steps-tab";
import FirstStep from "../../components/lead-form/steps/first-step";
import { FormNavButtons } from "../../components/lead-form/form-nav-buttons";
import { useForm, useWatch } from "react-hook-form";
import { SecondStep } from "../../components/lead-form/steps/second-step";
import { LastStep } from "../../components/lead-form/steps/last-step";
import { CreateLeadResultModal } from "../../components/lead-form/create-lead-result-modal";
import { mapCreateLeadFormToApi } from "../../components/lead-form/model/createLead.adapter";
import { useLeadsStore } from "../../app/store/leads-store";
import { ThirdStep } from "../../components/lead-form/steps/third-step";
import { ForthStep } from "../../components/lead-form/steps/forth-step";

import { DocumentsStep } from "../../components/lead-form/steps/documents-step";
import { uploadLeadFileApi } from "../../app/store/api";
import { useCustomerStore } from "../../app/store/customer";
import { useDriverStore } from "../../app/store/driver-store";
import DocumentUpload from "../../components/lead-form/steps/document-upload";

const steps = [
  "Маршрут",
  "Груз",
  "Водитель",
  "Заказщик",
  "Документы",
  "Проверка",
];

const stepFields = [
  ["from_location.address", "to_location.address", "loadingDate"],
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
  [],
  [],
];

const AddLeadForm = ({
  editingItemId = null,
  isEdit = false,
  openForm,
  setOpenForm,
  initialValues,
}) => {
  const createLead = useLeadsStore((state) => state.createLead);
  const updateLead = useLeadsStore((state) => state.updateLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  // const [maxAvailableStep, setMaxAvailableStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: null,
    title: "",
    message: "",
  });

  const defaultValues = {
    documents: [],
    ...initialValues,
  };

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  // const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;

  function getCreatedLeadId(response) {
    return (
      response?.data?.id ||
      response?.data?.lead_id ||
      response?.id ||
      response?.lead_id ||
      response?.result?.id ||
      null
    );
  }

  async function uploadCreateLeadDocuments(leadId, documents = []) {
    if (!leadId || !documents.length) {
      return;
    }

    for (const file of documents) {
      await uploadLeadFileApi(leadId, file);
    }
  }

  async function handleCreateRoute(data) {
    try {
      setIsSubmitting(true);

      const payload = mapCreateLeadFormToApi(data);

      // let response = null;
      let createdLeadId = editingItemId;
      let documentsUploadFailed = false;

      if (isEdit) {
        await updateLead(editingItemId, payload);
        await getLeadItem(editingItemId);

        if (payload.documents.length > 0 && createdLeadId) {
          try {
            await uploadCreateLeadDocuments(createdLeadId, payload.documents);
          } catch (documentError) {
            documentsUploadFailed = true;
            console.error(
              "Create lead documents upload failed:",
              documentError,
            );
          }
        }
      } else {
        const response = await createLead(payload);
        const createdLeadId = getCreatedLeadId(response);
        console.log("createdLeadId", createdLeadId);

        if (payload.documents.length > 0 && createdLeadId) {
          try {
            await uploadCreateLeadDocuments(createdLeadId, payload.documents);
          } catch (documentError) {
            documentsUploadFailed = true;
            console.error(
              "Create lead documents upload failed:",
              documentError,
            );
          }
        }

        // if (documents.length > 0 && !createdLeadId) {
        //   documentsUploadFailed = true;
        // }
      }

      handleClose();

      setResultModal({
        open: true,
        type: "success",
        title: isEdit ? "Перевозка отредактирована" : "Перевозка создана",
        message: documentsUploadFailed
          ? "Лид создан, но часть документов не загрузилась"
          : `Лид успешно ${isEdit ? "изменён" : "создан"}${
              createdLeadId ? `: ${createdLeadId}` : ""
            }`,
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

  const getCustomers = useCustomerStore((state) => state.getCustomers);
  const getDrivers = useDriverStore((state) => state.getDrivers);

  useEffect(() => {
    getCustomers();
    getDrivers();
  }, []);

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
        // return <DocumentsStep form={formValues} setValue={setValue} />;
        return (
          <DocumentUpload
            form={formValues}
            setValue={setValue}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        );

      case 5:
        return <LastStep form={formValues} />;
    }
  };

  function handleClose() {
    setActiveStep(0);
    // setMaxAvailableStep(0);
    reset({
      documents: [],
      ...defaultValues,
    });
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

    // setMaxAvailableStep((prevStep) => Math.max(prevStep, nextStep));
    setActiveStep(nextStep);
  }

  return (
    <>
      <Dialog open={openForm} onClose={handleClose} maxWidth="md" fullWidth>
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
            isSubmitting={isSubmitting}
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
