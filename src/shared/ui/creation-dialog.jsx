import MuiDialog from "@mui/material/Dialog";

export default function CreationDialog({
  onClose,
  slotProps,
  ...props
}) {
  const containerProps = slotProps?.container;

  return (
    <MuiDialog
      {...props}
      disableEscapeKeyDown
      onClose={() => {}}
      slotProps={{
        ...slotProps,
        container: (ownerState) => {
          const resolvedProps =
            typeof containerProps === "function"
              ? containerProps(ownerState)
              : containerProps;

          return {
            ...resolvedProps,
            onDoubleClick: (event) => {
              resolvedProps?.onDoubleClick?.(event);
              if (!event.defaultPrevented && event.target === event.currentTarget) {
                onClose?.(event, "backdropClick");
              }
            },
          };
        },
      }}
    />
  );
}
