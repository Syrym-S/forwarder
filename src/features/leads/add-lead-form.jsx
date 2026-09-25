import FormHeader from "../../components/lead-form/form-header";
import DocumentUpload from "../../components/lead-form/steps/document-upload";
import PriceStep from "../../components/lead-form/steps/price-step";
import LeadFormTabs from "../../components/lead-form/lead-form-tabs";
import CargoStep from "../../components/lead-form/steps/cargo-step";
import DriverStep from "../../components/lead-form/steps/driver-step";
import RouteStep from "../../components/lead-form/steps/route-step";
import CustomerStep from "../../components/lead-form/steps/customer-step";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { FormNavButtons } from "../../components/lead-form/form-nav-buttons";
import { useForm, useWatch } from "react-hook-form";
import { LastStep } from "../../components/lead-form/steps/last-step";
import { CreateLeadResultModal } from "../../components/lead-form/create-lead-result-modal";
import { mapCreateLeadFormToApi } from "../../components/lead-form/model/createLead.adapter";
import { uploadLeadFileApi } from "../../app/store/leads/api";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const steps = [
  { id: 1, label: "Маршрут" },
  { id: 2, label: "Груз" },
  { id: 3, label: "Водитель" },
  { id: 4, label: "Заказчик" },
  { id: 5, label: "Цены" },
  { id: 6, label: "Документы" },
  { id: 7, label: "Проверка" },
];

const stepFields = [
  ["from_location.address", "to_location.address", "point_schedules"],
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
  const currentLead = useLeadsStore((state) => state.currentLead);
  const createLead = useLeadsStore((state) => state.createLead);
  const updateLead = useLeadsStore((state) => state.updateLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const clearCurrentLead = useLeadsStore((state) => state.clearCurrentLead);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStepError] = useState(false);
  const [resultModal, setResultModal] = useState({
    open: false,
    type: null,
    title: "",
    message: "",
  });

  const defaultValues = {
    documents: [],
    pass_verify: false,
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

  console.log("formValues", formValues);

  const isLastStep = activeStep === steps.length;

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

      let createdLeadId = editingItemId;
      let documentsUploadFailed = false;

      if (isEdit) {
        delete payload.pass_verify;
        await updateLead(editingItemId, payload);
        clearCurrentLead();
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
      }

      handleClose();

      setResultModal({
        open: true,
        type: "success",
        title: isEdit ? "Перевозка отредактирована" : "Перевозка создана",
        message: documentsUploadFailed
          ? "Перевозка создана, но часть документов не загрузилась"
          : `Перевозка успешно ${isEdit ? "изменена" : "создана"}${
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

  const renderContent = (step) => {
    switch (step) {
      case 1:
        return (
          <RouteStep
            control={control}
            form={formValues}
            setValue={setValue}
            isEdit={isEdit}
          />
        );
      case 2:
        return (
          <CargoStep
            control={control}
            errors={errors}
            leadStatus={currentLead?.status}
          />
        );
      case 3:
        return (
          <DriverStep control={control} errors={errors} setValue={setValue} />
        );
      case 4:
        return (
          <CustomerStep control={control} errors={errors} setValue={setValue} />
        );
      case 5:
        return <PriceStep control={control} />;

      case 6:
        return (
          <DocumentUpload
            form={formValues}
            setValue={setValue}
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
          />
        );

      case 7:
        return <LastStep form={formValues} isEdit={isEdit} />;
    }
  };

  function handleClose() {
    setActiveStep(1);
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
    let fields = stepFields[activeStep - 1] || [];

    const isStepValid = await trigger(fields);

    if (!isStepValid) {
      return;
    }

    if (activeStep === 1) {
      fields = [
        "from_location.address",
        "to_location.address",
        "point_schedules",
      ];
    }

    if (
      activeStep === 2 &&
      (!formValues.cargos || formValues.cargos.length === 0)
    ) {
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
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
          <LeadFormTabs
            steps={steps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            isEdit={isEdit}
          />

          {renderContent(activeStep)}

          <FormNavButtons
            isEdit={isEdit}
            isFirstStep={activeStep === 1}
            isLastStep={activeStep === steps.length}
            hasCurrentStepErrors={hasStepError}
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
