function validPoint(point) {
  return Array.isArray(point) && point.length >= 2
    && point.slice(0, 2).every((value) => typeof value === "number" && Number.isFinite(value))
    && Math.abs(point[0]) <= 90 && Math.abs(point[1]) <= 180;
}

export function getRouteMapViewport({ routePoints = [], routes = [], markers = [], focusView, center, zoom }) {
  const candidates = [
    ...routePoints,
    ...routes.flatMap((route) => route.points || []),
    ...markers.map((marker) => marker.position),
  ].filter(validPoint);
  const points = [...new Map(candidates.map((point) => [`${point[0]},${point[1]}`, point.slice(0, 2)])).values()];

  // A selected address must never hide other stops that already belong to the route.
  if (points.length >= 2) return { type: "bounds", points };
  if (points.length === 1) {
    const focused = validPoint(focusView?.center)
      && focusView.center[0] === points[0][0] && focusView.center[1] === points[0][1];
    return { type: "point", center: points[0], zoom: focused ? focusView.zoom : 16 };
  }
  return validPoint(focusView?.center)
    ? { type: "point", center: focusView.center, zoom: focusView.zoom }
    : { type: "point", center, zoom };
}

export function applyRouteMapViewport(map, view) {
  map.stop();
  map.invalidateSize({ pan: false });
  if (view.type === "bounds") {
    const compact = map.getSize().x < 600;
    map.fitBounds(view.points, {
      paddingTopLeft: compact ? [40, 64] : [64, 72],
      paddingBottomRight: compact ? [40, 48] : [64, 60],
      maxZoom: 16,
      animate: false,
    });
  } else {
    map.setView(view.center, view.zoom, { animate: false });
  }
}
