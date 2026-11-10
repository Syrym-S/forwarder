export const AVATAR_SIZE = 400;

export async function cropAvatar(source, area, originalFile) {
  if (!area || area.width <= 0 || area.height <= 0) {
    throw new Error("No avatar crop selected");
  }

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to read avatar image"));
    img.src = source;
  });

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to crop avatar image");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    area.x, area.y, area.width, area.height,
    0, 0, AVATAR_SIZE, AVATAR_SIZE,
  );

  const type = originalFile.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("Unable to encode avatar image"));
    }, type, 0.92);
  });
  const extension = type === "image/png" ? "png" : "jpg";
  const name = originalFile.name.replace(/\.[^.]+$/, "") || "avatar";
  return new File([blob], `${name}.${extension}`, { type });
}
