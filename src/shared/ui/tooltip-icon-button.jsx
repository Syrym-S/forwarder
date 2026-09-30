import { forwardRef } from "react";
import { IconButton } from "@mui/material";
import ActionTooltip from "./action-tooltip";

const TooltipIconButton = forwardRef(function TooltipIconButton(
  { title, "aria-label": ariaLabel, disabled, ...props },
  ref,
) {
  const button = (
    <IconButton
      {...props}
      ref={ref}
      disabled={disabled}
      aria-label={ariaLabel || title}
    />
  );

  return (
    <ActionTooltip title={title || ariaLabel}>
      {disabled ? <span style={{ display: "inline-flex" }}>{button}</span> : button}
    </ActionTooltip>
  );
});

export default TooltipIconButton;
