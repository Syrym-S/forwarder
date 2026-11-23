import Dialog from "../../shared/ui/creation-dialog";
import appI18n from "../../i18n/index.js";
import FormHeader from "../../components/lead-form/form-header";
import DocumentUpload from "../../components/lead-form/steps/document-upload";
import PriceStep from "../../components/lead-form/steps/price-step";
import LeadFormTabs from "../../components/lead-form/lead-form-tabs";
import CargoStep from "../../components/lead-form/steps/cargo-step";
import TransportationParameters from "../../components/lead-form/steps/transportation-parameters";
import DriverStep from "../../components/lead-form/steps/driver-step";
import RouteStep from "../../components/lead-form/steps/route-step";
import CustomerStep from "../../components/lead-form/steps/customer-step";
import { Alert, Box, DialogContent, useMediaQuery } from "@mui/material";
import { useEffect, useId, useRef, useState } from "react";
import { FormNavButtons } from "../../components/lead-form/form-nav-buttons";
import { useForm, useWatch } from "react-hook-form";
import { LastStep } from "../../components/lead-form/steps/last-step";
import { CreateLeadResultModal } from "../../components/lead-form/create-lead-result-modal";
import { mapCreateLeadFormToApi } from "../../components/lead-form/model/createLead.adapter";
import { publishLeadApi, uploadLeadFileApi } from "../../app/store/leads/api";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { isDraftLead } from "../../shared/lib/lead-draft";
import { useTranslation } from "react-i18next";

const steps = [
  {
    id: 1,
    get label() {
      return appI18n.t("ui.route");
    },
  },
  {
    id: 2,
    get label() {
      return appI18n.t("ui.cargo");
    },
  },
  {
    id: 3,
    get label() {
      return appI18n.t("ui.driver");
    },
  },
  {
    id: 4,
    get label() {
      return appI18n.t("ui.customer");
    },
  },
  {
    id: 5,
    get label() {
      return appI18n.t("lead_form.prices");
    },
  },
  {
    id: 6,
    get label() {
      return appI18n.t("ui.documents");
    },
  },
  {
    id: 7,
    get label() {
      return appI18n.t("lead_form.review");
    },
  },
];

const stepFields = [
  ["from_location.address", "to_location.address", "point_schedules"],
  ["cargos"],
  ["forwarderId"],
  [],
  [],
];

const AddLeadForm = ({
  editingItemId = null,
  isEdit = false,
  withoutDriver = false,
  openForm,
  setOpenForm,
  initialValues,
  onSaved,
}) => {
  const { t } = useTranslation();
  const isCompactScreen = useMediaQuery(
    (theme) => `${theme.breakpoints.down("sm")}, (max-height: 500px) and (pointer: coarse)`,
  );
  const titleId = useId();
  const panelId = useId();
  const contentRef = useRef(null);
  const visibleSteps = steps
    .filter((step) => !withoutDriver || step.id !== 3)
    .map((step, index) => ({ ...step, id: index + 1, contentId: step.id }));
  const currentLead = useLeadsStore((state) => state.currentLead);
  const createLead = useLeadsStore((state) => state.createLead);
  const updateLead = useLeadsStore((state) => state.updateLead);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const isEditingDraft = isEdit && isDraftLead(currentLead);

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
    auto_start: false,
    pass_verify: false,
    is_international: null,
    ...initialValues,
    ...(withoutDriver ? { driver: null } : {}),
    cargos: initialValues?.cargos?.length
      ? initialValues.cargos
      : [{ name: "" }],
  };

  const {
    control,
    handleSubmit,
    getValues,
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

  const currentStepId = visibleSteps[activeStep - 1]?.contentId;
  const isLastStep = activeStep === visibleSteps.length;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, left: 0 });
  }, [activeStep]);

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

    for (const file of documents.filter((document) => document.file)) {
      await uploadLeadFileApi(leadId, file);
    }
  }

  async function handleCreateRoute(data, { isDraft = false } = {}) {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = mapCreateLeadFormToApi(data, { isDraft });
      if (withoutDriver) {
        delete payload.driver;
      }
      if (isDraft || !isEdit) {
        payload.is_draft = isDraft;
      }

      let createdLeadId = editingItemId;
      let documentsUploadFailed = false;

      if (isEdit) {
        delete payload.pass_verify;
        await updateLead(editingItemId, payload);

        if (payload.documents?.length > 0 && createdLeadId) {
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
        createdLeadId = getCreatedLeadId(response);

        if (payload.documents?.length > 0 && createdLeadId) {
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

      if (isEditingDraft && !isDraft) {
        await publishLeadApi(editingItemId);
      }
      if (isEdit) {
        await getLeadItem(editingItemId);
      }

      const successMessageKey = isDraft
        ? "lead_form.draft_saved_success"
        : isEditingDraft
          ? "lead_form.lead_published_success"
          : isEdit
            ? "lead_form.lead_updated_success"
            : "lead_form.lead_created_success";

      setResultModal({
        open: true,
        type: "success",
        isDraft,
        lead_id: createdLeadId,
        title: isDraft
          ? t("lead_form.draft_saved")
          : isEditingDraft
            ? t("lead_form.lead_published")
            : isEdit
              ? t("lead_form.lead_edited")
              : t("lead_form.lead_created"),
        message: documentsUploadFailed
          ? t(
              isDraft
                ? "lead_form.draft_documents_failed"
                : "lead_form.lead_documents_failed",
            )
          : `${t(successMessageKey)}${createdLeadId ? `: ${createdLeadId}` : ""}`,
      });
    } catch (error) {
      setResultModal({
        open: true,
        type: "error",
        title: isDraft
          ? t("lead_form.draft_save_error")
          : isEditingDraft
            ? t("lead_form.publication_error")
            : t("lead_form.save_error"),
        message:
          error.response?.data?.message ||
          error.message ||
          (isDraft
            ? t("lead_form.draft_save_failed")
            : t("lead_form.lead_save_failed")),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmitClick() {
    if (!isLastStep) {
      return;
    }

    await handleSubmit((data) => handleCreateRoute(data))();
  }

  async function handleSaveDraft() {
    await handleCreateRoute(getValues(), { isDraft: true });
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
          <Box sx={{ display: "grid", gap: 2 }}>
            <TransportationParameters control={control} />
            <CargoStep
              control={control}
              errors={errors}
              leadStatus={currentLead?.status}
            />
          </Box>
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
        return <LastStep form={formValues} isEdit={isEdit} withoutDriver={withoutDriver} />;
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
    let fields = stepFields[currentStepId - 1] || [];

    const isStepValid = await trigger(fields);

    if (!isStepValid) {
      return;
    }

    if (currentStepId === 1) {
      fields = [
        "from_location.address",
        "to_location.address",
        "point_schedules",
      ];
    }

    if (
      currentStepId === 2 &&
      (!formValues.cargos || formValues.cargos.length === 0)
    ) {
      return;
    }

    setActiveStep((prevStep) => prevStep + 1);
  }

  return (
    <>
      <Dialog
        open={openForm && resultModal.type !== "success"}
        onClose={isSubmitting ? undefined : handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isCompactScreen}
        aria-labelledby={titleId}
        slotProps={{
          paper: {
            sx: {
              m: isCompactScreen ? 0 : 3,
              borderRadius: isCompactScreen ? 0 : 3,
              maxHeight: isCompactScreen ? "100dvh" : "calc(100dvh - 48px)",
              height: isCompactScreen ? "100dvh" : undefined,
              overflow: "hidden",
              ...(isCompactScreen && {
                pt: "env(safe-area-inset-top, 0px)",
                pb: "env(safe-area-inset-bottom, 0px)",
                pl: "env(safe-area-inset-left, 0px)",
                pr: "env(safe-area-inset-right, 0px)",
              }),
            },
          },
        }}
      >
        <FormHeader
          titleId={titleId}
          isEdit={isEdit}
          activeStep={activeStep}
          stepsCount={visibleSteps.length}
          onClose={handleClose}
          disabled={isSubmitting}
        />
        <DialogContent
          ref={contentRef}
          id={panelId}
          sx={{
            p: { xs: 1.5, sm: 3 },
            minWidth: 0,
            minHeight: 0,
            bgcolor: "background.default",
            overscrollBehavior: "contain",
            "& .MuiBox-root, & .MuiFormControl-root, & .MuiAutocomplete-root": { minWidth: 0 },
            "& .MuiFormControl-root, & .MuiAutocomplete-root": { maxWidth: "100%" },
            "& .MuiInputBase-input": { minWidth: 0, fontSize: { xs: 16, sm: 14 } },
            "& input[type=date]": { boxSizing: "border-box", width: "100%", height: "auto", minHeight: 40 },
            "& .MuiTypography-root, & .MuiFormHelperText-root": { overflowWrap: "anywhere" },
            "& .MuiAutocomplete-root .MuiChip-root": { maxWidth: "100%", height: "auto", minHeight: 28 },
            "& .MuiAutocomplete-root .MuiChip-label": { whiteSpace: "normal", overflowWrap: "anywhere" },
          }}
        >
          {isEditingDraft && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t("lead_form.draft_description")}
            </Alert>
          )}
          <LeadFormTabs
            steps={visibleSteps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            isEdit={isEdit}
          />
          {renderContent(currentStepId)}
        </DialogContent>
        <FormNavButtons
          isEdit={isEdit}
          isDraft={isEditingDraft}
          isFirstStep={activeStep === 1}
          isLastStep={isLastStep}
          hasCurrentStepErrors={hasStepError}
          isSubmitting={isSubmitting}
          onClose={handleClose}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmitClick}
          onSaveDraft={handleSaveDraft}
        />
      </Dialog>

      <CreateLeadResultModal
        open={resultModal.open}
        type={resultModal.type}
        title={resultModal.title}
        message={resultModal.message}
        onClose={() => {
          if (resultModal.type === "success") {
            onSaved?.({
              isDraft: resultModal.isDraft,
              lead_id: resultModal.lead_id,
            });
            handleClose();
          }
          setResultModal({
            open: false,
            type: null,
            title: "",
            message: "",
          });
        }}
      />
    </>
  );
};

export default AddLeadForm;
