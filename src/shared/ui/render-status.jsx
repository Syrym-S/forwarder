import { STATUS } from "../const/tenders";
import { Box, Typography } from "@mui/material";

export const RenderStatusContent = ({ label, color = "#518ded" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          flexShrink: 0,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      ></Box>

      <Typography
        sx={{
          color: "#172B4D",
          fontSize: {
            xs: "0.7rem",
            sm: "0.8rem",
          },
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

const RenderStatus = ({ status }) => {
  switch (status) {
    case STATUS.new:
      return (
        <RenderStatusContent
          label={"Новый"}
          variant="contained"
          color="#51d861"
        />
      );

    case STATUS.active:
      return (
        <RenderStatusContent
          label={"Активный"}
          variant="outlined"
          color="#49b439"
        />
      );

    case STATUS.cancelled:
      return (
        <RenderStatusContent
          label={"Отменненый"}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.add_driver:
      return (
        <RenderStatusContent label={"Водитель добавлен"} variant="outlined" />
      );

    case STATUS.start_driver:
      return (
        <RenderStatusContent label={"Поездка начата"} variant="contained" />
      );

    case STATUS.loading:
      return <RenderStatusContent label={"Погрузка"} variant="contaned" />;

    case STATUS.start_loading:
      return <RenderStatusContent label={"Погрузка"} variant="outlined" />;

    case STATUS.verification_loading:
      return (
        <RenderStatusContent
          label={"Погрузка подтверждена"}
          variant="contained"
        />
      );

    case STATUS.start_unloading:
      return <RenderStatusContent label={"Разгрузка"} variant="outlined" />;

    case STATUS.unloading:
      return <RenderStatusContent label={"Разгрузка"} variant="contaned" />;

    case STATUS.verification_unloading:
      return (
        <RenderStatusContent
          label={"Разгрузка подтверждена"}
          variant="outlined"
        />
      );

    case STATUS.finished:
      return (
        <RenderStatusContent
          label={"Рейс завершен"}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.deleted:
      return (
        <RenderStatusContent
          label={"Рейс удален"}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.loss:
      return (
        <RenderStatusContent
          label={"Проиграна"}
          variant="outlined"
          color="#c60606"
        />
      );

    case STATUS.closed:
      return (
        <RenderStatusContent
          label={"Закрыто"}
          variant="container"
          color="#c60606"
        />
      );

    case STATUS.winning:
      return <RenderStatusContent label={"Выиграна"} variant="outlined" />;

    case STATUS.await_paid:
      return (
        <RenderStatusContent label={"В ожидании оплаты"} variant="outlined" />
      );

    case STATUS.verified_participant:
      return (
        <RenderStatusContent label={"На подтверждении"} variant="outlined" />
      );

    case STATUS.approved:
      return <RenderStatusContent label={"Подтверждено"} variant="outlined" />;

    default:
      return <>Нет статуа</>;
  }
};

export default RenderStatus;
