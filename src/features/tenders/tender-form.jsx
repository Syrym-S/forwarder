import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { useTendersStore } from "../../app/store/tenders/tender-store";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Loader from "../../components/layout/loader";
import { useParams } from "react-router-dom";
import ChooseLeadStep from "./steps/choose-lead-step";
import PublicationTypeStep from "./steps/publication-type-step";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { useDriverStore } from "../../app/store/drivers/driver-store";

const steps = [
  { id: 1, get name() { return appI18n.t("ui.lead_selection"); } },
  { id: 2, get name() { return appI18n.t("ui.publication_type"); } },
];

const stepFields = {
  1: ["lead", "public_date_time", "end_date_time", "participants"],
};

const prepareTenderData = (form, selectedDrivers) => {
  return {
    lead_id: form?.lead.id || "",
    public_date_time:
      dayjs(form?.public_date_time).format("YYYY-MM-DD HH:mm:ss") || "",
    end_date_time:
      dayjs(form?.end_date_time).format("YYYY-MM-DD HH:mm:ss") || "",
    type: "shipper",
    publication_type: form?.publication_type ? "public" : "private",
    max_participants: form?.max_participants || 0,
    participants: selectedDrivers.map((user) => user.id),
  };
};

const TenderForm = ({
  isEdit = false,
  openForm,
  handleCloseForm,
  defaultValues = {},
}) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const { id } = useParams();
  const { control, setValue, trigger, getValues } = useForm({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const formValues = useWatch({ control });

  const isLoading = useLeadsStore((state) => state.isLoading);
  const getTenders = useTendersStore((state) => state.getTenders);
  const getTenderDetails = useTendersStore((state) => state.getTenderDetails);
  const createTender = useTendersStore((state) => state.createTender);
  const updateTender = useTendersStore((state) => state.updateTender);
  const getDrivers = useDriverStore((state) => state.getDrivers);
  const addParticipant = useTendersStore((state) => state.addParticipant);

  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const isSelectedDriversExists = selectedDrivers?.length !== 0;

  const renderContent = (step) => {
    switch (step) {
      case 1:
        return (
          <ChooseLeadStep
            control={control}
            isEdit={isEdit}
            setValue={setValue}
            getValues={getValues}
          />
        );
      case 2:
        return (
          <PublicationTypeStep
            error={error}
            setError={setError}
            control={control}
            formValues={formValues}
            selectedDrivers={selectedDrivers}
            setSelectedDrivers={setSelectedDrivers}
            setValue={setValue}
          />
        );
    }
  };

  const isLastStep = steps.length === step;
  const isFirstStep = step === 1;

  const handleNextStep = async () => {
    const isValid = await trigger(stepFields[step]);

    if (!isValid) return;

    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async () => {
    setIsSubmitLoading(true);
    const payload = prepareTenderData(formValues, selectedDrivers);

    if (!isSelectedDriversExists && !formValues?.publication_type) {
      setError(t("ui.add_at_least_one_driver"));

      return;
    }

    try {
      if (isEdit) {
        await updateTender(id, payload);

        await Promise.allSettled(
          selectedDrivers.map((driver) =>
            addParticipant(id, {
              participant_id: driver.id,
            }),
          ),
        );
        await getTenderDetails(id);
        await getTenders();
      } else {
        const response = await createTender(payload);

        await Promise.allSettled(
          selectedDrivers.map((driver) =>
            addParticipant(response.data.id, {
              participant_id: driver.id,
            }),
          ),
        );

        await getTenders();
      }
      handleCloseForm();
    } catch (e) {
      console.log(e);
    }

    setIsSubmitLoading(false);
  };

  useEffect(() => {
    getDrivers();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Dialog
      open={openForm}
      onClose={handleCloseForm}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialogTitle-root": { fontSize: 20, fontWeight: 600, color: "font_color.heading" },
        "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 14, bgcolor: "background.paper" },
        "& .MuiInputLabel-root": { fontSize: 14 },
        "& .MuiFormHelperText-root": { fontSize: 12 },
        "& .MuiFormControlLabel-label": { fontSize: 14, color: "text.primary" },
        "& .MuiButton-root": { fontSize: 14, fontWeight: 500, textTransform: "none" },
      }}
    >
      <DialogTitle>
        {isEdit ? t("ui.edit_auction") : t("ui.create_auction_heading")}
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {renderContent(step)}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isFirstStep ? (
            <Button variant="outlined" color="error" onClick={handleCloseForm}>{t("ui.cancel")}</Button>
          ) : (
            <Button variant="outlined" color="error" onClick={handlePrevStep}>{t("ui.back")}</Button>
          )}

          {isLastStep ? (
            <Button
              variant="contained"
              onClick={onSubmit}
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              {isSubmitLoading && (
                <CircularProgress
                  size={13}
                  sx={{
                    color: "white",
                  }}
                />
              )}
              {isEdit ? t("ui.save_2") : t("ui.create_2")}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNextStep}>{t("ui.next")}</Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TenderForm;
