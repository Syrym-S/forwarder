import appI18n from "../../../i18n/index.js";
import { useTranslation } from "react-i18next";
import { Alert } from "@mui/material";
import React from "react";

const returnText = (error) => {
  switch (error) {
    case "":
      return;
    case "Image dimensions must not exceed 600x600px":
      return appI18n.t("ui.profile_photo_dimensions_error");
    case "Image dimensions must be at least 400x400px":
      return appI18n.t("ui.profile_photo_dimensions_error");
    case "Only PNG and JPEG images are allowed":
      return appI18n.t("ui.profile_photo_format_error");
    default:
      return error;
  }
};
const RenderErrorContext = ({ error }) => {
  useTranslation();
  return <Alert severity="error">{returnText(error)}</Alert>;
};

export default RenderErrorContext;
