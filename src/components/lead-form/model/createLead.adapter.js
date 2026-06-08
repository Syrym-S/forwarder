function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function toNumber(value) {
  if (!hasValue(value)) {
    return null;
  }

  const number = Number(value);

  return Number.isNaN(number) ? null : number;
}

function addIfHasValue(target, key, value) {
  if (hasValue(value)) {
    target[key] = value;
  }
}

function addNumberIfHasValue(target, key, value) {
  const number = toNumber(value);

  if (number !== null) {
    target[key] = number;
  }
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

export function mapCreateLeadFormToApi(form) {
  const fromLocation = normalizeText(form.fromLocation);
  const toLocation = normalizeText(form.toLocation);

  const payload = {
    forwarder: form.forwarderId,

    from_country: "Казахстан",
    from_region: "",
    from_city: fromLocation,
    from_address: fromLocation,

    to_country: "Казахстан",
    to_region: "",
    to_city: toLocation,
    to_address: toLocation,

    cargo_name: form.cargoType || "Не указан",
    cargo_type: form.cargoType || "Не указан",
    currency: form.currency || "KZT",
    vat: form.vat ? "с НДС" : "без НДС",
  };

  addIfHasValue(payload, "loading_date", form.loadingDate);
  addIfHasValue(payload, "comment", normalizeText(form.comment));

  addNumberIfHasValue(payload, "from_lat", form.fromLat);
  addNumberIfHasValue(payload, "from_lon", form.fromLng);
  addNumberIfHasValue(payload, "to_lat", form.toLat);
  addNumberIfHasValue(payload, "to_lon", form.toLng);

  addNumberIfHasValue(payload, "cargo_weight", form.weightKg);
  addNumberIfHasValue(payload, "cargo_length", form.cargoLengthCm);
  addNumberIfHasValue(payload, "cargo_width", form.cargoWidthCm);
  addNumberIfHasValue(payload, "cargo_height", form.cargoHeightCm);

  addNumberIfHasValue(payload, "price", form.price);

  return payload;
}

export function mapCreatedLeadToUi(form, response = {}) {
  console.log(form);
  const id = response.id ?? `created-lead-${Date.now()}`;

  return {
    id,

    num: response.num ?? 1,

    status: response.status ?? "started",

    customer:
      response.customer?.name ||
      response.customer ||
      "AKE Plast (АКЕ Пласт) ТОО",

    driver: form.driver?.fullName || "Не назначен",

    description: form.comment || `Груз заявки #${id}`,

    from_location: form.fromLocation,

    to_location: form.toLocation,

    transportation_price: Number(form.price) || 0,

    summ: Number(form.price) || 0,

    currency: form.currency || "KZT",

    vat: form.vat ? "с НДС" : "без НДС",

    gsm: false,

    weight_kg: Number(form.weightKg) || 0,

    volume_cm:
      Number(form.cargoLengthCm || 0) *
      Number(form.cargoWidthCm || 0) *
      Number(form.cargoHeightCm || 0),

    context: null,

    cargo: {
      description: form.comment || `Груз заявки #${id}`,

      type: form.cargoType || "Не указан",

      weight_kg: Number(form.weightKg) || 0,
    },

    created_at: response.created_at ?? {
      date: new Date().toISOString(),
      timezone: "UTC",
      timezone_type: 3,
    },
  };
}
