import { WAYPOINT_TYPES } from "../const/tenders";
import { Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";

const RenderChip = ({ label, color = "primary", variant, size = "medium" }) => {
  return (
    <Chip
      label={label}
      variant={variant}
      size={size}
      color={color}
      sx={(theme) => ({
        width: "fit-content",
        maxWidth: "100%",
        height: size === "small" ? 24 : 28,
        borderRadius: 5,
        fontSize: size === "small" ? 11 : 12,
        fontWeight: 600,
        color: theme.palette[color]?.main || theme.palette.text.secondary,
        backgroundColor: alpha(
          theme.palette[color]?.main || theme.palette.text.secondary,
          0.08,
        ),
        border: "1px solid",
        borderColor: alpha(
          theme.palette[color]?.main || theme.palette.text.secondary,
          0.16,
        ),
        "& .MuiChip-label": {
          px: 1.25,
          lineHeight: 1.4,
        },
      })}
    />
  );
};

const RenderType = ({ type, size }) => {
  switch (type) {
    case WAYPOINT_TYPES.loading:
      return (
        <RenderChip
          label={"Точка для погрузки"}
          variant="outlined"
          color="primary"
          size={size}
        />
      );
    case WAYPOINT_TYPES.unloading:
      return (
        <RenderChip
          label={"Точка для разгрузки"}
          variant="outlined"
          color="primary"
          size={size}
        />
      );

    default:
      return (
        <RenderChip
          label={"Промежуточная"}
          variant="outlined"
          color="primary"
          size={size}
        />
      );
  }
};

export default RenderType;
