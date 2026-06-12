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

export function mapCreateLeadDocumentsToApiDocuments(data) {
  const documents = data?.documents || [];

  return Array.isArray(documents)
    ? documents
        .filter((document) => document.file)
        .map((document) => ({
          name: document.name || document.fileName || "Документ",
          context: document.context || "",
          file: document.file,
        }))
    : [];
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
  console.log("mapCreateLeadFormToApi", form);
  const fromLocation = normalizeText(form.fromLocation);
  const toLocation = normalizeText(form.toLocation);

  const payload = {
    from_location: form.from_location,
    to_location: form.to_location,
    cargo: {
      description: null,
      height_cm: +form.height_cm,
      length_cm: +form.length_cm,
      name: form.name || "Не указан",
      type: form.type,
      weight_kg: form.weight_kg,
      width_cm: form.width_cm,
    },
    from_city: form.from_location.city,
    to_city: form.to_location.city,
    cargo_name: form.name || "Не указан",
    vat: form.vat,
  };
  //   const payload = {
  //     forwarder: form.forwarderId,

  //     from_country: fromLocation,
  //     from_region: fromLocation,
  //     from_city: fromLocation,
  //     from_address: fromLocation,

  //     to_country: "Казахстан",
  //     to_region: fromLocation,
  //     to_city: toLocation,
  //     to_address: toLocation,

  //     cargo_name: form.cargoType || "Не указан",
  //     cargo_type: form.cargoType || "Не указан",
  //     currency: form.currency || "KZT",
  //     vat: form.vat ? "с НДС" : "без НДС",
  //   };

  addIfHasValue(payload, "loading_date", form.loadingDate);
  addIfHasValue(payload, "comment", normalizeText(form.comment));

  addNumberIfHasValue(payload, "from_lat", form.fromLat);
  addNumberIfHasValue(payload, "from_lon", form.fromLng);
  addNumberIfHasValue(payload, "to_lat", form.toLat);
  addNumberIfHasValue(payload, "to_lon", form.toLng);

  addNumberIfHasValue(payload, "cargo_weight", form.weight_kg);
  addNumberIfHasValue(payload, "cargo_length", form.cargo_length_cm);
  addNumberIfHasValue(payload, "cargo_width", form.cargo_width_cm);
  addNumberIfHasValue(payload, "cargo_height", form.cargo_height_cm);

  addNumberIfHasValue(payload, "summ", form.summ);

  return payload;
}

export function mapCreatedLeadToUi(form, response = {}) {
  const id = response.id ?? `created-lead-${Date.now()}`;

  return {
    id,

    num: response.num ?? 1,

    status: response.status ?? "started",

    customer: form.customer.id,

    driver: form.driver[0].id,

    description: form.comment || `Груз заявки #${id}`,

    from_city: form.fromLocation,

    to_city: form.toLocation,

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
    cargo_name: form.cargoType,

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
