import { useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Chip, Dialog,
  DialogActions, DialogContent, DialogTitle, List, ListItemButton,
  ListItemText, Paper, Stack, TextField, Typography,
} from "@mui/material";
import RootLayout from "../../components/layout/root-layout";
import {
  COMPLAINT_FILE_ACCEPT, complaintsSince, getComplaintStatus, validateComplaint,
} from "../../shared/lib/complaints";

const dateLabel = (value) => value ? new Date(value).toLocaleString("ru-RU") : "";
const targets = [
  { id: "demo-lead", type: "Lead", label: "Перевозка №1024 · Алматы → Астана" },
  { id: "demo-factor", type: "FactorPurchase", label: "Факторинг №128 · Оплата перевозки Алматы → Астана" },
];

export default function Complaints() {
  const [request, setRequest] = useState("");
  const [target, setTarget] = useState(null);
  const [files, setFiles] = useState([]);
  const [items, setItems] = useState([]);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const detail = items.find((item) => item.id === selectedId);
  const recentItems = items.filter((item) => item.created_at >= complaintsSince());

  function submit(event) {
    event.preventDefault();
    setSuccess(false);
    const validation = validateComplaint(request, files);
    setFormError(validation);
    if (validation) return;
    const now = new Date().toISOString();
    setItems((current) => [{
      id: crypto.randomUUID(), request: request.trim(), target,
      files: files.map((file) => ({ id: crypto.randomUUID(), name: file.name, file })),
      response: null, final_status: null, acceptance_at: null, finaled_at: null,
      created_at: now, updated_at: now,
    }, ...current]);
    setRequest("");
    setTarget(null);
    setFiles([]);
    setSuccess(true);
  }

  function addFiles(event) {
    const next = [...files, ...Array.from(event.target.files || [])];
    event.target.value = "";
    const validation = validateComplaint("Описание", next);
    setFormError(validation);
    if (!validation) setFiles(next);
  }

  function download(file) {
    const url = URL.createObjectURL(file.file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <RootLayout withoutDataCheck>
      <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto" }}>
        <Typography variant="h5">Жалобы</Typography>
        <Alert severity="info">Демонстрация интерфейса. Жалобы не отправляются и исчезнут после перезагрузки. Перевозка и факторинг в списке — примеры.</Alert>
        <Paper component="form" onSubmit={submit} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Отправить жалобу</Typography>
            {success && <Alert severity="success">Жалоба добавлена в демонстрационный список</Alert>}
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField
              label="Описание" required multiline minRows={4} value={request}
              onChange={(event) => setRequest(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 1000 } }} helperText={`${request.length}/1000`}
            />
            <Autocomplete
              options={targets} value={target}
              onChange={(_, value) => setTarget(value)}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.type === value.type && option.id === value.id}
              noOptionsText="Нет перевозок или факторингов за последние 30 дней"
              renderInput={(params) => <TextField {...params} label="Перевозка / факторинг" helperText="Необязательно. За последние 30 дней" />}
            />
            <Box>
              <Button component="label" variant="outlined" disabled={files.length >= 3}>
                Добавить файлы
                <input hidden type="file" multiple accept={COMPLAINT_FILE_ACCEPT} onChange={addFiles} />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                До 3 файлов, каждый до 100 МБ. Изображения, видео, DOCX, PDF.
              </Typography>
            </Box>
            {files.map((file, index) => (
              <Chip key={`${index}-${file.name}`} label={file.name}
                onDelete={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                sx={{ maxWidth: "100%", alignSelf: "start" }} />
            ))}
            <Button type="submit" variant="contained" sx={{ alignSelf: "start" }}>
              Отправить жалобу
            </Button>
          </Stack>
        </Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>Мои жалобы за последние 30 дней</Typography>
          {recentItems.length === 0 ? (
            <Alert severity="info">Вы пока не отправляли жалобы за последние 30 дней.</Alert>
          ) : (
            <List>
              {recentItems.map((item) => {
                const status = getComplaintStatus(item);
                return (
                  <ListItemButton key={item.id} onClick={() => setSelectedId(item.id)} sx={{ gap: 2, flexWrap: "wrap" }}>
                    <ListItemText primary={item.request} secondary={`${dateLabel(item.created_at)} · ${item.response ? "Ответ получен" : "Ответа пока нет"}`}
                      slotProps={{ primary: { sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } } }} sx={{ minWidth: 0 }} />
                    <Chip label={status.label} color={status.color} size="small" />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Paper>
      </Stack>
      <Dialog open={selectedId !== null} onClose={() => setSelectedId(null)} fullWidth maxWidth="sm">
        <DialogTitle>Жалоба</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {detail && <>
              <Chip {...getComplaintStatus(detail)} sx={{ alignSelf: "start" }} />
              <Typography variant="caption">{dateLabel(detail.created_at)}</Typography>
              {detail.target && <Typography>{detail.target.label}</Typography>}
              <Typography variant="subtitle2">Причина обращения</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{detail.request}</Typography>
              <Typography variant="subtitle2">Ответ</Typography>
              <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{detail.response || "Ответа пока нет"}</Typography>
              {detail.acceptance_at && <Typography variant="caption">Принята: {dateLabel(detail.acceptance_at)}</Typography>}
              {detail.finaled_at && <Typography variant="caption">Закрыта: {dateLabel(detail.finaled_at)}</Typography>}
              {(detail.files || []).map((file) => (
                <Button key={file.id} onClick={() => download(file)} sx={{ justifyContent: "start", overflowWrap: "anywhere" }}>
                  {file.name || "Скачать файл"}
                </Button>
              ))}
            </>}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setSelectedId(null)}>Закрыть</Button></DialogActions>
      </Dialog>
    </RootLayout>
  );
}
