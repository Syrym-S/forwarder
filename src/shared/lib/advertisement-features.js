export const getAdvertisementAccess = (features) => {
  const my = features?.advertisement_forwarder !== false;
  const customer = features?.advertisement_customer !== false;
  return { my, customer, enabled: my || customer };
};

export const getAvailableAdvertisementType = (selectedType, access) => {
  if (selectedType === "customer" && access.customer) return "customer";
  if (access.my) return "my";
  return access.customer ? "customer" : null;
};
