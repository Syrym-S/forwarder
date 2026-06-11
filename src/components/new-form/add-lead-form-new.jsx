import { Dialog, DialogContent } from "@mui/material";
import React, { useState } from "react";
import FormHeader from "../lead-form/form-header";
import LeadFormHeader from "./lead-form-header";
import LeadFormActions from "./lead-form-actions";
import LeadRouteStep from "./steps/lead-route-step";
import LeadCargoStep from "./steps/lead-cargo-step";
import LeadDriverStep from "./steps/lead-driver-step";
import LeadCustomerStep from "./steps/lead-customer-step";
import LeadSubmitStep from "./steps/lead-submit-step";
import LeadFormTabs from "./lead-form-tabs";
import { useForm, useWatch } from "react-hook-form";

const steps = [
  { id: 1, label: "Маршрут" },
  { id: 2, label: "Груз" },
  { id: 3, label: "Водитель" },
  { id: 4, label: "Заказщик" },
  { id: 5, label: "Проверка" },
];

const AddLeadFormNew = ({ openForm, setOpenForm }) => {
  const [activeStep, setActiveStep] = useState(1);
  const { control, handleSubmit, setValue, formState: errors } = useForm();

  const formValues = useWatch({ control });

  console.log("formValues", formValues);

  const nexpStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setActiveStep(1);
  };

  const renderFormStep = (step) => {
    switch (step) {
      case 1:
        return (
          <LeadRouteStep
            form={formValues}
            control={control}
            setValue={setValue}
          />
        );
      case 2:
        return (
          <LeadCargoStep control={control} errors={errors} form={formValues} />
        );
      case 3:
        return (
          <LeadDriverStep
            control={control}
            errors={errors}
            setValue={setValue}
          />
        );
      case 4:
        return <LeadCustomerStep />;
      case 5:
        return <LeadSubmitStep />;
    }
  };

  return (
    <Dialog open={openForm} maxWidth="md" fullWidth onClose={handleCloseForm}>
      <LeadFormHeader activeStep={activeStep} steps={steps} />

      <DialogContent sx={{ px: 3 }}>
        <LeadFormTabs steps={steps} activeStep={activeStep} />

        {renderFormStep(activeStep)}

        <LeadFormActions
          previousStep={previousStep}
          activeStep={activeStep}
          steps={steps}
          nexpStep={nexpStep}
          handleCloseForm={handleCloseForm}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddLeadFormNew;
