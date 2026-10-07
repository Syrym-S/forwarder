import { transportationParameters } from "../../../shared/const/leads/transportation-parameters";
import { isInternationalRoute } from "../../../shared/lib/international-route";

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

export function mapCreateLeadFormToApi(form, { isDraft = false } = {}) {
  const isInternational = isInternationalRoute(form);
  const cargos = (form.cargos || []).map((cargo) => {
    if (isInternational) return cargo;
    const domesticCargo = { ...cargo };
    delete domesticCargo.tnved_code;
    return domesticCargo;
  });
  const cargoFields = [
    "cargo_type",
    "name",
    "tnved_code",
    "comment",
    "weight_kg",
    "length_cm",
    "width_cm",
    "height_cm",
  ];
  const hasEmptyCargos = cargos.every((cargo) =>
    cargoFields.every((field) => !hasValue(cargo?.[field])),
  );

  const payload = {
    pass_verify: form.pass_verify === true,
    is_international: isInternational,
    from_country: form.from_location?.address,
    from_region: form.from_location?.address,
    from_city: form.from_location?.address,
    from_address: form.from_location?.address,

    to_country: form.to_location?.address,
    to_region: form.to_location?.address,
    to_city: form.to_location?.address,
    to_address: form.to_location?.address,

    name: form.name || "Не указан",
    currency: form.currency || "KZT",
    price: form.price || 0,
    cargos: isDraft && hasEmptyCargos ? null : cargos,
    point_schedules: form.point_schedules || [],
  };

  addIfHasValue(payload, "waypoints", form.waypoints);
  for (const { name } of transportationParameters) {
    const value = normalizeText(form[name]?.name ?? form[name]);
    if (value) {
      payload[name] = value;
    }
  }
  addIfHasValue(payload, "loading_date", form.loadingDate);
  addIfHasValue(payload, "description", normalizeText(form.description));
  addIfHasValue(payload, "driver", form.driver?.id);
  addIfHasValue(payload, "customer", form.customer?.id);
  addIfHasValue(payload, "documents", form.documents);

  addNumberIfHasValue(payload, "from_lat", hasValue(form.fromLat) ? form.fromLat : form.from_location?.lat);
  addNumberIfHasValue(payload, "from_lon", hasValue(form.fromLng) ? form.fromLng : form.from_location?.lng ?? form.from_location?.lon);
  addNumberIfHasValue(payload, "to_lat", hasValue(form.toLat) ? form.toLat : form.to_location?.lat);
  addNumberIfHasValue(payload, "to_lon", hasValue(form.toLng) ? form.toLng : form.to_location?.lng ?? form.to_location?.lon);

  addNumberIfHasValue(payload, "cargo_weight", form.weight_kg);
  addNumberIfHasValue(payload, "cargo_length", form.length_cm);
  addNumberIfHasValue(payload, "cargo_width", form.width_cm);
  addNumberIfHasValue(payload, "cargo_height", form.height_cm);
  addNumberIfHasValue(payload, "cargo_price", form.cargo_price);

  addNumberIfHasValue(
    payload,
    "transportation_price",
    form.transportation_price,
  );
  addNumberIfHasValue(payload, "price", form.price);

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

    description: form.description || `Груз заявки #${id}`,

    from_city: form.fromLocation,

    to_city: form.toLocation,

    transportation_price: Number(form.price) || 0,

    summ: Number(form.summ) || 0,

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
