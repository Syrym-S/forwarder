export const STATUS = {
  cancelled: "cancelled",
  new: "new",
  active: "active",
  add_driver: "add_driver",
  start_driver: "start_driver",
  start_loading: "start_loading",
  verification_loading: "verification_loading",
  start_unloading: "start_unloading",
  verification_unloading: "verification_unloading",
  finished: "finished",
  deleted: "deleted",
  closed: "closed",
  verified_participant: "verified_participant",
  await_paid: "await_paid",
};

export const LEAD_STATUS_OPTIONS = [
  { label: "Новый", value: "new" },
  { label: "Водитель добавлен", value: "add_driver" },
  { label: "Поездка начата", value: "start_driver" },
  { label: "Погрузка", value: "start_loading" },
  { label: "Погрузка подтверждена", value: "verification_loading" },
  { label: "Разгрузка", value: "start_unloading" },
  { label: "Разгрузка подтверждена", value: "verification_unloading" },
  { label: "Рейс завершен", value: "finished" },
  { label: "Рейс удален", value: "deleted" },
];

export const ACTIVE_LEAD_STATUS_OPTIONS = [
  { label: "Новый", value: "new" },
  { label: "Водитель добавлен", value: "add_driver" },
  { label: "Поездка начата", value: "start_driver" },
  { label: "Погрузка", value: "start_loading" },
  { label: "Погрузка подтверждена", value: "verification_loading" },
  { label: "Разгрузка", value: "start_unloading" },
  { label: "Разгрузка подтверждена", value: "verification_unloading" },
];

export const HISTORY_LEAD_STATUS_OPTIONS = [
  { label: "Рейс завершен", value: "finished" },
  { label: "Рейс удален", value: "deleted" },
];
