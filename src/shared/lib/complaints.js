import appI18n from "../../i18n/index.js";
export const MAX_COMPLAINT_FILES = 3;
export const MAX_COMPLAINT_FILE_SIZE = 100 * 1024 * 1024;
export const COMPLAINT_FILE_ACCEPT = "image/*,video/*,.docx,.pdf";

export function validateComplaint(request, files = []) {
  if (!request.trim()) return appI18n.t("ui.enter_complaint_description");
  if (request.length > 1000) return appI18n.t("ui.complaint_description_max_length");
  if (files.length > MAX_COMPLAINT_FILES) return appI18n.t("ui.maximum_three_files");
  for (const file of files) {
    if (file.size > MAX_COMPLAINT_FILE_SIZE) return appI18n.t("ui.file_size_exceeded", { value1: file.name });
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/") &&
        !/\.(pdf|docx)$/i.test(file.name)) {
      return appI18n.t("ui.unsupported_named_file", { value1: file.name });
    }
  }
  return "";
}

export function getComplaintStatus(complaint) {
  if (complaint.final_status === "completed" || complaint.state === "completed") return { label: appI18n.t("ui.completed"), color: "success" };
  if (complaint.final_status === "rejected" || complaint.state === "rejected") return { label: appI18n.t("ui.rejected_feminine"), color: "error" };
  if (complaint.state === "in_work" || complaint.acceptance_at) return { label: appI18n.t("ui.in_progress"), color: "info" };
  return { label: appI18n.t("ui.awaiting_review"), color: "default" };
}

export function getComplaintTargetLabel(target) {
  if (target.type === "factoring") {
    return [appI18n.t("ui.factoring"), target.lead_num != null && appI18n.t("ui.for_lead_number", { value1: target.lead_num }),
      target.factor, target.summ != null && `${Number(target.summ).toLocaleString(appI18n.resolvedLanguage)} ${target.currency || ""}`]
      .filter(Boolean).join(" · ");
  }
  return [target.num != null ? appI18n.t("ui.lead_number_label", { value1: target.num }) : appI18n.t("ui.lead"),
    [target.from_city, target.to_city].filter(Boolean).join(" → ")].filter(Boolean).join(" · ");
}

export function complaintsSince(now = new Date()) {
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
}
