import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import InfoItem from "../../shared/ui/info-item";

const SavedDataModal = ({ savedData, setSavedData }) => {
  const handleClose = () => {
    setSavedData(null);
  };

  const handleCopy = async (url) => {
    const text = `Логин: ${savedData?.email}
      Пароль: ${savedData?.password}
      Ссылка: ${url}`;

    await navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Сохранённые данные</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          {/* Логин */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            p={2}
            border="1px solid #e0e0e0"
            borderRadius={1}
          >
            <Box>
              <InfoItem label={"Логин"} value={savedData?.login} />
            </Box>
          </Box>

          {/* Пароль */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            p={2}
            border="1px solid #e0e0e0"
            borderRadius={1}
          >
            <Box>
              <InfoItem label={"Пароль"} value={savedData?.password} />
            </Box>
          </Box>

          {/* Apple */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            p={2}
            border="1px solid #e0e0e0"
            borderRadius={1}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InfoItem
                label="Apple URL"
                value={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      noWrap
                      title={savedData.ios_invite_link}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {savedData.ios_invite_link}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCopy(savedData.ios_invite_link)}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Копировать
                    </Button>
                  </Box>
                }
              />
            </Box>
          </Box>

          {/* Android */}
          {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            p={2}
            border="1px solid #e0e0e0"
            borderRadius={1}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <InfoItem
                label="Android URL"
                value={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      noWrap
                      title={savedData.android_invite_link}
                      sx={{ flex: 1, minWidth: 0 }}
                    >
                      {savedData.android_invite_link}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCopy(savedData.android_invite_link)}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Копировать Android
                    </Button>
                  </Box>
                }
              />
            </Box>
          </Box> */}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedDataModal;
