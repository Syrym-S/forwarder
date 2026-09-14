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
  const appleUrl = "https://example.com/apple/download";
  const androidUrl = "https://example.com/android/download";

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
    <Dialog open={Boolean(savedData)} maxWidth="sm" fullWidth>
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
              <InfoItem label={"Логин"} value={savedData?.email} />
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
              <InfoItem label={"Пороль"} value={savedData?.password} />
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
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{appleUrl}</Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCopy(appleUrl)}
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      Копировать Apple
                    </Button>
                  </Box>
                }
              />
            </Box>
          </Box>

          {/* Android */}
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
                label="Android URL"
                value={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>{androidUrl}</Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCopy(androidUrl)}
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
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedDataModal;
