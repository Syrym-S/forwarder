import { Tooltip } from "@mui/material";

const ActionTooltip = (props) => (
  <Tooltip
    placement="top"
    arrow
    disableInteractive
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: "grey.900",
            px: 1.5,
            py: 1,
            borderRadius: 2,
            fontSize: 12,
            fontWeight: 500,
            boxShadow: 3,
          },
        },
        arrow: { sx: { color: "grey.900" } },
      }}
    {...props}
  />
);

export default ActionTooltip;
