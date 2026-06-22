export const getFileType = (file) => {
  const ext = file?.path?.split(".").pop()?.toLowerCase();

  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) {
    return "image";
  }

  if (ext === "pdf") {
    return "pdf";
  }

  return "unknown";
};
