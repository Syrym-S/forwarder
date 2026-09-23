import { Alert } from "@mui/material";

const RenderErroMessage = ({ error }) => {
  switch (error) {
    case "Image dimensions must not exceed 600x600px":
      return (
        <Alert severity="error">
          Размер фото для профиля должен быть от 400 × 400 до 600 × 600 пикселей
        </Alert>
      );
    case "Only PNG and JPEG images are allowed":
      return (
        <Alert severity="error">Фото должно быть формата PNG или JPEG</Alert>
      );
  }
};

export default RenderErroMessage;
