import { Alert } from "@mui/material";

const RenderErroMessage = ({ error }) => {
  switch (error) {
    case "Image dimensions must not exceed 600x600px":
      return (
        <Alert severity="error">
          Размер фото для профиля должна быть между 400x400 - 600x600
        </Alert>
      );
    case "Only PNG and JPEG images are allowed":
      return (
        <Alert severity="error">Фото должно быть формата PNG или JPEG</Alert>
      );
  }
};

export default RenderErroMessage;
