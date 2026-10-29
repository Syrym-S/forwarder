import { useTranslation } from "react-i18next";
import { Alert } from "@mui/material";

const RenderErroMessage = ({ error }) => {
  const { t } = useTranslation();
  switch (error) {
    case "Image dimensions must not exceed 600x600px":
      return (
        <Alert severity="error">{t("ui.profile_photo_dimensions_error")}</Alert>
      );
    case "Only PNG and JPEG images are allowed":
      return (
        <Alert severity="error">{t("ui.profile_photo_format_error")}</Alert>
      );
  }
};

export default RenderErroMessage;
