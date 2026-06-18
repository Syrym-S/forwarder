import { TENDER_STATUS } from "../const/tenders";
import { Chip } from "@mui/material";

const RenderStatus = ({ status }) => {
  switch (status) {
    case TENDER_STATUS.new:
      return <Chip label={"Новый"} variant="outlined" color="success" />;
    case TENDER_STATUS.cancelled:
      return <Chip label={"Отменненый"} variant="outlined" color="error" />;
  }
};

export default RenderStatus;
