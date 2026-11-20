export function getLoginErrorMessage(error) {
  const data = error?.response?.data;
  const backendError = data?.error || data?.message || data?.data?.message;

  if (
    typeof backendError === "string" &&
    backendError.trim().toLowerCase() === "invalid credentials"
  ) {
    return "Неверный email или пароль";
  }

  return "Ошибка входа. Попробуйте позже.";
}
