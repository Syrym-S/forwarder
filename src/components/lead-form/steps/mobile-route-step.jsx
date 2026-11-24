import { Box, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SHEET_STOPS = [12, 30, 60, 92];

const clampHeight = (height) => Math.min(92, Math.max(12, height));

const snapHeight = (height) =>
  SHEET_STOPS.reduce((closest, stop) =>
    Math.abs(stop - height) < Math.abs(closest - height) ? stop : closest,
  );

const MobileRouteStep = ({
  mapView,
  pointControls,
  actions,
  mapSearch,
  restriction,
  options,
  children,
}) => {
  const { t } = useTranslation();

  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);

  const [sheetHeight, setSheetHeight] = useState(30);
  const [isDragging, setDragging] = useState(false);

  const getDragHeight = (clientY, drag) =>
    clampHeight(
      drag.height + ((drag.startY - clientY) / drag.containerHeight) * 100,
    );

  const handlePointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    const containerHeight =
      containerRef.current?.getBoundingClientRect().height;
    if (!containerHeight) return;

    draggedRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      height: sheetHeight,
      containerHeight,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.abs(event.clientY - drag.startY) > 4) draggedRef.current = true;
    setSheetHeight(getDragHeight(event.clientY, drag));
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setSheetHeight(snapHeight(getDragHeight(event.clientY, drag)));
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    draggedRef.current = true;
    setDragging(false);
    setSheetHeight(drag.height);
  };

  const handleKeyDown = (event) => {
    const nextHeight = {
      ArrowUp: sheetHeight + 10,
      ArrowDown: sheetHeight - 10,
      PageUp: sheetHeight + 30,
      PageDown: sheetHeight - 30,
      Home: SHEET_STOPS[0],
      End: SHEET_STOPS.at(-1),
      Enter: sheetHeight < 60 ? 60 : 30,
      " ": sheetHeight < 60 ? 60 : 30,
    }[event.key];
    if (nextHeight === undefined) return;
    event.preventDefault();
    setSheetHeight(clampHeight(nextHeight));
  };

  return (
    <Box
      ref={containerRef}
      component="section"
      aria-label={t("ui.route")}
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <Box
        sx={{
          height: "100%",
          position: "relative",
          zIndex: 0,
          isolation: "isolate",
          overflow: "hidden",
          bgcolor: "background.default",
          "& .leaflet-container": { zIndex: 0 },
          "& .leaflet-bottom": { bottom: `calc(${sheetHeight}% + 8px)` },
        }}
      >
        {mapView}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            maxWidth: "calc(100% - 72px)",
            zIndex: 1,
            p: 1,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: 2,
            "& > .MuiBox-root": { flexWrap: "nowrap", overflowX: "auto" },
            "& .MuiButton-root": {
              flexShrink: 0,
              minHeight: 36,
              fontSize: 12,
              whiteSpace: "nowrap",
            },
          }}
        >
          {pointControls}
        </Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: `${sheetHeight}%`,
          minHeight: 48,
          maxHeight: "100%",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "24px 24px 0 0",
          bgcolor: "background.paper",
          boxShadow: 3,
          transition: isDragging ? "none" : "height 220ms ease-out",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <Box
          role="slider"
          tabIndex={0}
          aria-label={t("ui.route")}
          aria-orientation="vertical"
          aria-valuemin={SHEET_STOPS[0]}
          aria-valuemax={SHEET_STOPS.at(-1)}
          aria-valuenow={Math.round(sheetHeight)}
          aria-valuetext={`${Math.round(sheetHeight)}%`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onLostPointerCapture={handlePointerCancel}
          onKeyDown={handleKeyDown}
          onClick={() => {
            if (draggedRef.current) {
              draggedRef.current = false;
              return;
            }
            setSheetHeight((height) => (height < 60 ? 60 : 30));
          }}
          sx={{
            flexShrink: 0,
            minHeight: 48,
            boxSizing: "border-box",
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
            touchAction: "none",
            userSelect: "none",
            cursor: isDragging ? "grabbing" : "ns-resize",
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: -3,
            },
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 4,
              borderRadius: 2,
              bgcolor: "text.disabled",
            }}
          />
          <Typography
            component="h3"
            sx={{ m: 0, fontSize: 16, fontWeight: 600 }}
          >
            {t("ui.route")}
          </Typography>
        </Box>
        <Box
          onFocusCapture={(event) => {
            if (
              event.target.matches(
                "input:not([type=checkbox]):not([type=radio]), textarea, select",
              )
            ) {
              setSheetHeight((height) => Math.max(height, 60));
            }
          }}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            px: 2,
            pt: 1,
            pb: 2,
          }}
        >
          {restriction}
          {mapSearch}
          {children}
          <Box sx={{ mt: 2 }}>{actions}</Box>
          <Box sx={{ mt: 2, borderTop: "1px solid", borderColor: "divider" }}>
            {options}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileRouteStep;
