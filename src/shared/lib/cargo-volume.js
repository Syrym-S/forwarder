export const cargoDimensionFields = ["length_cm", "width_cm", "height_cm"];

export function hasCargoValue(value) {
  return value !== null && value !== undefined && value !== "";
}

export function isPositiveCargoNumber(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

export function calculateCargoVolume(cargo = {}) {
  if (!cargoDimensionFields.every((key) => isPositiveCargoNumber(cargo[key]))) {
    return null;
  }
  const volume = cargoDimensionFields.reduce(
    (result, key) => result * (Number(cargo[key]) / 100),
    1,
  );
  return isPositiveCargoNumber(volume) ? Number(volume.toPrecision(12)) : null;
}

export function getCargoVolume(cargo = {}) {
  return hasCargoValue(cargo.cargo_demention)
    ? Number(cargo.cargo_demention)
    : calculateCargoVolume(cargo);
}

export function mapCargoToApi(cargo) {
  const result = { ...cargo, cargo_demention: getCargoVolume(cargo) };
  for (const key of cargoDimensionFields) {
    if (hasCargoValue(cargo[key])) {
      result[key] = Number(cargo[key]);
    } else {
      delete result[key];
    }
  }
  return result;
}
