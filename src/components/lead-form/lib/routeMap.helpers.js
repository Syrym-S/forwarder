export function hasPoint(lat, lng) {
  return (
    lat !== "" &&
    lat !== null &&
    lat !== undefined &&
    lng !== "" &&
    lng !== null &&
    lng !== undefined
  );
}

export function getRouteMarkers(form) {
  const markers = [];

  if (
    hasPoint(
      form.from_location.lat,
      form.from_location.lon || form.from_location.lng,
    )
  ) {
    markers.push({
      id: "from",
      position: [
        Number(form.from_location.lat),
        Number(form.from_location.lon || form.from_location.lng),
      ],
      title: "Точка A",
      description: "Откуда",
      draggable: true,
    });
  }

  if (
    hasPoint(form.to_location.lat, form.to_location.lon || form.to_location.lng)
  ) {
    markers.push({
      id: "to",
      position: [
        Number(form.to_location.lat),
        Number(form.to_location.lon || form.to_location.lng),
      ],
      title: "Точка B",
      description: "Куда",
      draggable: true,
    });
  }

  return markers;
}

export function getRoutePoints(form) {
  const hasFromPoint = hasPoint(
    form.from_location.lat,
    form.from_location.lon || form.from_location.lng,
  );
  const hasToPoint = hasPoint(
    form.to_location.lat,
    form.to_location.lon || form.to_location.lng,
  );

  if (!hasFromPoint || !hasToPoint) {
    return [];
  }

  return [
    [
      Number(form.from_location.lat),
      Number(form.from_location.lon || form.from_location.lng),
    ],
    [
      Number(form.to_location.lat),
      Number(form.to_location.lon || form.to_location.lng),
    ],
  ];
}
