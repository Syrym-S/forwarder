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

  form.waypoints.map((waypoint, index) => {
    if (hasPoint(waypoint.lat, waypoint.lon || waypoint.lng)) {
      markers.push({
        id: `cross.${index}`,
        position: [Number(waypoint.lat), Number(waypoint.lon || waypoint.lng)],
        title: `Точка ${index}`,
        description: `Точка пересечения ${index}`,
        draggable: true,
      });
    }
  });

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

  if (!hasFromPoint) {
    return [];
  }

  const points = [
    [
      Number(form.from_location.lat),
      Number(form.from_location.lon || form.from_location.lng),
    ],
  ];

  form.waypoints.map((waypoint) => {
    if (hasPoint(waypoint.lat, waypoint.lon || waypoint.lng)) {
      console.log("push");
      points.push([Number(waypoint.lat), Number(waypoint.lon || waypoint.lng)]);
    } else {
      console.log("Не пуш");
    }
  });

  if (hasToPoint) {
    points.push([
      Number(form.to_location.lat),
      Number(form.to_location.lon || form.to_location.lng),
    ]);
  }

  return points;
}
