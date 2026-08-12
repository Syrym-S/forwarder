export const renderLineColor = (persent) => {
  if (persent < 50) {
    return "#3baed8";
  } else if (persent >= 50 && persent < 80) {
    return "#dd611f";
  } else if (persent >= 80) {
    return "#d00000";
  }
};
