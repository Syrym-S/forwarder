export const VIEWS = {
  table: "table",
  cards: "cards",
};

export const steps = ["Маршрут", "Груз", "Водитель", "Заказщик", "Проверка"];

export const initialForm = {
  // customer: 'AKE Plast (АКЕ Пласт) ТОО',
  // contactName: 'Suleimenov Syrym',
  // phone: '+7 777 777 77 77',

  fromLocation: "",
  fromLat: "",
  fromLng: "",

  toLocation: "",
  toLat: "",
  toLng: "",

  loadingDate: "2026-06-10",

  cargoType: "Не указан",
  weightKg: "1200",
  cargoLengthCm: "50",
  cargoWidthCm: "50",
  cargoHeightCm: "70",
  price: "250000",
  currency: "KZT",
  vat: true,
  comment: "",

  forwarderId: "",
  forwarder: null,
};
