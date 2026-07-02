import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useProfileStore } from "../../app/store/profile/profile-store";

const UploadAvatar = ({
  selectedImg,
  preview,
  handleFileChange,
  formValues,
  handleClearAvatar,
}) => {
  const isProfileLoading = useProfileStore((state) => state.isProfileLoading);
  const isAvatarLoading = useProfileStore((state) => state.isAvatarLoading);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        alignItems: "center",
      }}
    >
      <IconButton>
        {isAvatarLoading || isProfileLoading ? (
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "100%",
              border: "5px solid",
              borderColor: "primary.main",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !selectedImg && !formValues?.avatar ? (
          <AccountCircleIcon
            color="primary"
            sx={{
              fontSize: "7rem",
            }}
          />
        ) : (
          <Box
            component="img"
            sx={{
              display: "block",
              borderRadius: "100%",
              width: "100px",
              height: "100px",
              border: 0,
              maxWidth: "100%",
              maxHeight: 200,
              objectFit: "contain",
            }}
            src={formValues?.avatar || preview}
          />
        )}
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography>Фото профиля</Typography>
        <Typography>PNG или JPEG, размер от 400x400 до 600x600 px</Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button
            variant="outlined"
            component="label"
            sx={{
              minHeight: 40,
              width: {
                xs: "100%",
                md: "auto",
              },
            }}
          >
            Загрузить фото
            <input
              name="file"
              type="file"
              hidden
              accept=".jpeg,.png"
              onChange={handleFileChange}
            />
          </Button>
          {(selectedImg || formValues?.avatar) && (
            <Button
              color="error"
              variant="outlined"
              onClick={handleClearAvatar}
            >
              Удалить
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UploadAvatar;
