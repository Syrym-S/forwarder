import { Chip } from "@mui/material";
import { NOTIFICATION_TYPE } from "../const/notification-types";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";

const RenderNotificationIcon = ({ type }) => {
  switch (type) {
    case NOTIFICATION_TYPE.lead:
      return <RouteOutlinedIcon color="primary" />;
    case NOTIFICATION_TYPE.shipping:
      return <LocalShippingOutlinedIcon color="primary" />;
    case NOTIFICATION_TYPE.tender:
      return <ContentPasteOutlinedIcon color="primary" />;
    case NOTIFICATION_TYPE.factor:
      return <FactoryOutlinedIcon color="primary" />;
    default:
      return <>Нет Типа</>;
  }
};

export default RenderNotificationIcon;
