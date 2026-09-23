import { Alert } from "@mui/material";
import React from "react";

const returnText = (error) => {
  switch (error) {
    case "":
      return;
    case "Image dimensions must not exceed 600x600px":
      return "Размер фото для профиля должен быть от 400 × 400 до 600 × 600 пикселей";
    case "Image dimensions must be at least 400x400px":
      return "Размер фото для профиля должен быть от 400 × 400 до 600 × 600 пикселей";
    case "Only PNG and JPEG images are allowed":
      return "Фото должно быть формата PNG или JPEG";
    default:
      return error;
  }
};
const RenderErrorContext = ({ error }) => {
  return <Alert severity="error">{returnText(error)}</Alert>;
};

export default RenderErrorContext;
