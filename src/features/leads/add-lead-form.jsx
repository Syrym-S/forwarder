import { Dialog, DialogTitle } from "@mui/material";
import React from "react";

const AddLeadForm = ({ openForm, setOpenForm }) => {
  return (
    <Dialog open={openForm}>
      <DialogTitle>AddLeadForm</DialogTitle>
    </Dialog>
  );
};

export default AddLeadForm;
