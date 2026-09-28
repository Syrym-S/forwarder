export const moneySpacingFormat = (number) => {
  if (number === null || number === undefined || number === "") {
    return "—";
  }

  // Group only the integer part, preserving decimal digits and their separator.
  return number.toString().replace(/^[+-]?\d+(?=[.,]|$)/, (integer) =>
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
  );
};
