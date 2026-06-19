import { STATUS } from "../const/tenders";
import { Chip } from "@mui/material";

const RenderStatus = ({ status }) => {
  switch (status) {
    case STATUS.new:
      return <Chip label={"Новый"} variant="contained" color="success" />;
    case STATUS.active:
      return <Chip label={"Активный"} variant="outlined" color="success" />;
    case STATUS.cancelled:
      return <Chip label={"Отменненый"} variant="outlined" color="error" />;
    case STATUS.add_driver:
      return (
        <Chip label={"Водитель добавлен"} variant="outlined" color="warning" />
      );
    case STATUS.start_driver:
      return (
        <Chip label={"Поездка начата"} variant="contained" color="warning" />
      );
    case STATUS.start_loading:
      return <Chip label={"Погрузка"} variant="outlined" color="warning" />;
    case STATUS.verification_loading:
      return (
        <Chip
          label={"Погрузка подтверждена"}
          variant="contained"
          color="warning"
        />
      );
    case STATUS.start_unloading:
      return <Chip label={"Разгрузка"} variant="outlined" color="success" />;
    case STATUS.verification_unloading:
      return (
        <Chip
          label={"Разгрузка подтверждена"}
          variant="outlined"
          color="error"
        />
      );
    case STATUS.finished:
      return (
        <Chip label={"Рейс завершен"} variant="outlined" color="success" />
      );
    case STATUS.deleted:
      return <Chip label={"Рейс удален"} variant="outlined" color="error" />;
  }
};

export default RenderStatus;
