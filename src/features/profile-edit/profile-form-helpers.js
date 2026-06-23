export const initialProfileForm = {
  companyName: "",
  companyBin: "",
  companyAddress: "",
  companyAccount: "",
  companyBik: "",

  personFio: "",
  personPhone: "",
  personEmail: "",
  personIin: "",

  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",

  personDocumentNumber: "",
  personIssueCountry: "",
};

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function onlyDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

function normalizeProfileValue(value) {
  return String(value ?? "").trim();
}

function normalizeDigitsValue(value) {
  return String(value ?? "").replace(/\D/g, "");
}

export function mapProfileFromApi(profile) {
  return {
    companyName: profile?.companyName || "",
    companyBin: profile?.companyBin || "",
    companyAddress: profile?.companyAddress || "",
    companyAccount: profile?.companyAccount || "",
    companyBik: profile?.companyBik || "",

    personFio: profile?.personFio || "",
    personPhone: profile?.personPhone || "",
    personEmail: profile?.personEmail || "",
    personIin: profile?.personIin || "",

    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",

    personDocumentNumber: profile?.personDocumentNumber || "",
    personIssueCountry: profile?.personIssueCountry || "",
  };
}

export function mapProfileFormToChangedApi(form, initialForm) {
  const payload = {};

  const comparableFields = [
    "companyName",
    "companyAddress",
    "companyAccount",
    "companyBik",
    "personFio",
    "personPhone",
    "personEmail",
    "personDocumentNumber",
    "personIssueCountry",
  ];

  comparableFields.forEach((field) => {
    const nextValue = normalizeProfileValue(form[field]);
    const prevValue = normalizeProfileValue(initialForm?.[field]);

    if (nextValue && nextValue !== prevValue) {
      payload[field] = nextValue;
    }
  });

  const nextCompanyBin = normalizeDigitsValue(form.companyBin);
  const prevCompanyBin = normalizeDigitsValue(initialForm?.companyBin);

  if (nextCompanyBin && nextCompanyBin !== prevCompanyBin) {
    payload.companyBin = nextCompanyBin;
  }

  const nextPersonIin = normalizeDigitsValue(form.personIin);
  const prevPersonIin = normalizeDigitsValue(initialForm?.personIin);

  if (nextPersonIin && nextPersonIin !== prevPersonIin) {
    payload.personIin = nextPersonIin;
  }

  const currentPassword = normalizeProfileValue(form.currentPassword);
  const newPassword = normalizeProfileValue(form.newPassword);
  const newPasswordConfirm = normalizeProfileValue(form.newPasswordConfirm);

  if (currentPassword || newPassword || newPasswordConfirm) {
    payload.currentPassword = currentPassword;
    payload.newPassword = newPassword;
    payload.newPasswordConfirm = newPasswordConfirm;
  }

  return payload;
}

export function validateProfileForm(form) {
  const errors = {};

  const companyName = normalizeText(form.companyName);
  const companyBin = onlyDigits(form.companyBin);
  const companyAddress = normalizeText(form.companyAddress);
  const companyAccount = normalizeText(form.companyAccount).toUpperCase();
  const companyBik = normalizeText(form.companyBik);
  const personEmail = normalizeText(form.personEmail);
  const personIin = onlyDigits(form.personIin);
  const personIssueCountry = normalizeText(form.personIssueCountry);

  const currentPassword = String(form.currentPassword ?? "").trim();
  const newPassword = String(form.newPassword ?? "").trim();
  const newPasswordConfirm = String(form.newPasswordConfirm ?? "").trim();

  const wantsPasswordChange =
    currentPassword || newPassword || newPasswordConfirm;

  if (companyName && (companyName.length < 2 || companyName.length > 100)) {
    errors.companyName = "От 2 до 100 символов";
  }

  if (companyBin && !/^\d{12}$/.test(companyBin)) {
    errors.companyBin = "БИН должен содержать 12 цифр";
  }

  if (
    companyAddress &&
    (companyAddress.length < 2 || companyAddress.length > 255)
  ) {
    errors.companyAddress = "От 2 до 255 символов";
  }

  if (companyAccount && !/^KZ[A-Z0-9]{18}$/i.test(companyAccount)) {
    errors.companyAccount = "Формат: KZ + 18 символов";
  }

  if (companyBik && companyBik.length !== 8) {
    errors.companyBik = "БИК должен содержать 8 символов";
  }

  if (personEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personEmail)) {
    errors.personEmail = "Некорректный email";
  }

  if (personIin && !/^\d{12}$/.test(personIin)) {
    errors.personIin = "ИИН должен содержать 12 цифр";
  }

  if (personIssueCountry && !/^[A-Z]{2}$/.test(personIssueCountry)) {
    errors.personIssueCountry = "Введите 2 буквы, например KZ";
  }

  if (wantsPasswordChange) {
    if (!currentPassword) {
      errors.currentPassword = "Введите текущий пароль";
    }

    if (!newPassword) {
      errors.newPassword = "Введите новый пароль";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Минимум 6 символов";
    }

    if (!newPasswordConfirm) {
      errors.newPasswordConfirm = "Повторите новый пароль";
    } else if (newPasswordConfirm !== newPassword) {
      errors.newPasswordConfirm = "Пароли не совпадают";
    }
  }

  return errors;
}
