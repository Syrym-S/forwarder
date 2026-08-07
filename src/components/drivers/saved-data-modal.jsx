import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import InfoField from "../../shared/ui/info-field";

const SavedDataModal = ({ savedData, setSavedData }) => {
  const handleClose = () => {
    setSavedData(null);
  };

  const handleCopyAll = async () => {
    const text = `Логин: ${savedData?.email}
    Пароль: ${savedData?.password}`;

    await navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={savedData} maxWidth="sm" fullWidth>
      <DialogTitle>Сохранённые данные</DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
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
              <InfoField label={"Логин"} value={savedData?.email} />
            </Box>
          </Box>

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
              <InfoField label={"Логин"} value={savedData?.password} />
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" size="small" onClick={handleCopyAll}>
          Копировать
        </Button>
        <Button onClick={handleClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SavedDataModal;
