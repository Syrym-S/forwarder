import appI18n from "../../i18n/index.js";
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
  personDocumentIssueDate: "",
  personDocumentIssuedBy: "",
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
    personDocumentIssueDate: profile?.personDocumentIssueDate || "",
    personDocumentIssuedBy: profile?.personDocumentIssuedBy || "",

    avatar: profile?.avatar || "",
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
    "personDocumentIssueDate",
    "personDocumentIssuedBy",
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
    errors.companyName = appI18n.t("ui.length_two_to_one_hundred");
  }

  if (companyBin && !/^\d{12}$/.test(companyBin)) {
    errors.companyBin = appI18n.t("ui.bin_twelve_digits");
  }

  if (
    companyAddress &&
    (companyAddress.length < 2 || companyAddress.length > 255)
  ) {
    errors.companyAddress = appI18n.t("ui.length_two_to_two_hundred_fifty_five");
  }

  if (companyAccount && !/^KZ[A-Z0-9]{18}$/i.test(companyAccount)) {
    errors.companyAccount = appI18n.t("ui.iban_format_hint");
  }

  if (companyBik && companyBik.length !== 8) {
    errors.companyBik = appI18n.t("ui.bic_eight_characters");
  }

  if (personEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personEmail)) {
    errors.personEmail = appI18n.t("ui.invalid_email");
  }

  if (personIin && !/^\d{12}$/.test(personIin)) {
    errors.personIin = appI18n.t("ui.iin_twelve_digits");
  }

  if (personIssueCountry && !/^[A-Z]{2}$/.test(personIssueCountry)) {
    errors.personIssueCountry = appI18n.t("ui.country_code_hint");
  }

  if (wantsPasswordChange) {
    if (!currentPassword) {
      errors.currentPassword = appI18n.t("ui.enter_current_password");
    }

    if (!newPassword) {
      errors.newPassword = appI18n.t("ui.enter_new_password");
    } else if (newPassword.length < 6) {
      errors.newPassword = appI18n.t("ui.minimum_six_characters");
    }

    if (!newPasswordConfirm) {
      errors.newPasswordConfirm = appI18n.t("ui.repeat_new_password");
    } else if (newPasswordConfirm !== newPassword) {
      errors.newPasswordConfirm = appI18n.t("ui.passwords_do_not_match");
    }
  }

  return errors;
}
