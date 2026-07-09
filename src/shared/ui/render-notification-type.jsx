import { Chip } from "@mui/material";
import { NOTIFICATION_TYPE } from "../const/notification-types";
import { parserNotificationType } from "../helpers/notifications/parse-notification-type";

const RenderNotificationType = ({ type }) => {
  const { notification_type } = parserNotificationType(type);

  switch (notification_type) {
    case NOTIFICATION_TYPE.lead:
      return <Chip label={"ЛИД"} variant="contained" color="success" />;
    case NOTIFICATION_TYPE.shipping:
      return <Chip label={"ПЕРЕВОЗКА"} variant="contained" color="primary" />;
    case NOTIFICATION_TYPE.tender:
      return <Chip label={"ТЕНДЕР"} variant="contained" color="error" />;
    case NOTIFICATION_TYPE.factor:
      return <Chip label={"ФАКТОР"} variant="contained" color="warning" />;
    default:
      return <>Нет Типа</>;
  }
};

export default RenderNotificationType;
