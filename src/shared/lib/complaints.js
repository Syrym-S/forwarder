export const MAX_COMPLAINT_FILES = 3;
export const MAX_COMPLAINT_FILE_SIZE = 100 * 1024 * 1024;
export const COMPLAINT_FILE_ACCEPT = "image/*,video/*,.docx,.pdf";

export function validateComplaint(request, files = []) {
  if (!request.trim()) return "Укажите описание жалобы";
  if (request.length > 1000) return "Описание должно содержать не больше 1000 символов";
  if (files.length > MAX_COMPLAINT_FILES) return "Можно приложить не больше 3 файлов";
  for (const file of files) {
    if (file.size > MAX_COMPLAINT_FILE_SIZE) return `Файл «${file.name}» превышает 100 МБ`;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/") &&
        !/\.(pdf|docx)$/i.test(file.name)) {
      return `Недопустимый формат файла «${file.name}»`;
    }
  }
  return "";
}

export function getComplaintStatus(complaint) {
  if (complaint.final_status === "completed" || complaint.state === "completed") return { label: "Завершена", color: "success" };
  if (complaint.final_status === "rejected" || complaint.state === "rejected") return { label: "Отклонена", color: "error" };
  if (complaint.state === "in_work" || complaint.acceptance_at) return { label: "В работе", color: "info" };
  return { label: "Ожидает рассмотрения", color: "default" };
}

export function getComplaintTargetLabel(target) {
  if (target.type === "factoring") {
    return ["Факторинг", target.lead_num != null && `по перевозке №${target.lead_num}`,
      target.factor, target.summ != null && `${Number(target.summ).toLocaleString("ru-RU")} ${target.currency || ""}`]
      .filter(Boolean).join(" · ");
  }
  return [target.num != null ? `Перевозка №${target.num}` : "Перевозка",
    [target.from_city, target.to_city].filter(Boolean).join(" → ")].filter(Boolean).join(" · ");
}

export function complaintsSince(now = new Date()) {
  return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
}
