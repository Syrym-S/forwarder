import { WAYPOINT_TYPES } from "../const/tenders";
import { Chip } from "@mui/material";

const RenderChip = ({ label, color, variant, size = "large" }) => {
  return (
    <Chip
      label={label}
      variant={variant}
      size={size}
      color={color}
      sx={{
        width: "fit-content",
        fontSize: {
          xs: "0.6rem",
          sm: "0.8rem",
        },
      }}
    />
  );
};

const RenderType = ({ type, size }) => {
  switch (type) {
    case WAYPOINT_TYPES.loading:
      return (
        <RenderChip
          label={"Точка для погрузки"}
          variant="contaned"
          color="primary"
          size={size}
        />
      );
    case WAYPOINT_TYPES.unloading:
      return (
        <RenderChip
          label={"Точка для разгрузки"}
          variant="contaned"
          color="primary"
          size={size}
        />
      );

    case WAYPOINT_TYPES.check_passes:
      return (
        <RenderChip
          label={"Промежуточная"}
          variant="contaned"
          color="primary"
          size={size}
        />
      );
    default:
      return <>Нет статуа</>;
  }
};

export default RenderType;
