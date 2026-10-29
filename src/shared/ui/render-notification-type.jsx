import { useTranslation } from "react-i18next";
import { Chip } from "@mui/material";
import { NOTIFICATION_TYPE } from "../const/notification-types";
import { parserNotificationType } from "../helpers/notifications/parse-notification-type";

const RenderNotificationType = ({ type }) => {
  const { t } = useTranslation();
  const { notification_type } = parserNotificationType(type);

  switch (notification_type) {
    case NOTIFICATION_TYPE.lead:
      return <Chip label={t("ui.lead")} variant="contained" color="success" />;
    case NOTIFICATION_TYPE.shipping:
      return <Chip label={t("ui.lead")} variant="contained" color="primary" />;
    case NOTIFICATION_TYPE.tender:
      return <Chip label={t("ui.auction")} variant="contained" color="error" />;
    case NOTIFICATION_TYPE.factor:
      return <Chip label={t("ui.factor_2")} variant="contained" color="warning" />;
    case NOTIFICATION_TYPE.total:
      return <Chip label={t("ui.broadcast")} variant="contained" color="primary" />;
    default:
      return <>{t("ui.no_type")}</>;
  }
};

export default RenderNotificationType;
