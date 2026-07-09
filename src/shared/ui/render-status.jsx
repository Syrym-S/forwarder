import { STATUS } from "../const/tenders";
import { Chip } from "@mui/material";

const RenderChip = ({ label, color, variant }) => {
  return (
    <Chip
      label={label}
      variant={variant}
      color={color}
      sx={{
        fontSize: {
          xs: "0.6rem",
          sm: "0.8rem",
        },
      }}
    />
  );
};

const RenderStatus = ({ status }) => {
  switch (status) {
    case STATUS.new:
      return <Chip label={"Новый"} variant="contained" color="info" />;
    case STATUS.active:
      return (
        <RenderChip label={"Активный"} variant="outlined" color="success" />
      );
    case STATUS.cancelled:
      return (
        <RenderChip label={"Отменненый"} variant="outlined" color="error" />
      );
    case STATUS.add_driver:
      return (
        <RenderChip
          label={"Водитель добавлен"}
          variant="outlined"
          color="info"
        />
      );
    case STATUS.start_driver:
      return (
        <RenderChip
          label={"Поездка начата"}
          variant="contained"
          color="primary"
        />
      );
    case STATUS.start_loading:
      return (
        <RenderChip label={"Погрузка"} variant="outlined" color="warning" />
      );
    case STATUS.verification_loading:
      return (
        <RenderChip
          label={"Погрузка подтверждена"}
          variant="contained"
          color="success"
        />
      );
    case STATUS.start_unloading:
      return (
        <RenderChip label={"Разгрузка"} variant="outlined" color="success" />
      );
    case STATUS.verification_unloading:
      return (
        <RenderChip
          label={"Разгрузка подтверждена"}
          variant="outlined"
          color="warning"
        />
      );
    case STATUS.finished:
      return (
        <RenderChip
          label={"Рейс завершен"}
          variant="outlined"
          color="success"
        />
      );
    case STATUS.deleted:
      return (
        <RenderChip label={"Рейс удален"} variant="outlined" color="error" />
      );
    case STATUS.loss:
      return (
        <RenderChip label={"Не принято"} variant="outlined" color="error" />
      );
    case STATUS.closed:
      return <RenderChip label={"Закрыто"} variant="container" color="error" />;
    case STATUS.winning:
      return (
        <RenderChip
          label={"Принятая ставка"}
          variant="outlined"
          color="error"
        />
      );
    case STATUS.await_paid:
      return (
        <RenderChip
          label={"В ожидании оплаты"}
          variant="outlined"
          color="secondary"
        />
      );
    case STATUS.verified_participant:
      return (
        <RenderChip
          label={"На подтверждении"}
          variant="outlined"
          color="warning"
        />
      );
    default:
      return <>Нет статуа</>;
  }
};

export default RenderStatus;
