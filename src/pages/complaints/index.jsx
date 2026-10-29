import appI18n from "../../i18n/index.js";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormInput from "../../shared/ui/input/form-input";
import PrimaryButton from "../../shared/ui/button/primary-button";
import RootLayout from "../../components/layout/root-layout";
import {
  COMPLAINT_FILE_ACCEPT,
  MAX_COMPLAINT_FILES,
  complaintsSince,
  getComplaintStatus,
  getComplaintTargetLabel,
  validateComplaint,
} from "../../shared/lib/complaints";

const dateLabel = (value) =>
  value ? new Date(value).toLocaleString(appI18n.resolvedLanguage) : "";
import { useComplaintStore } from "../../app/store/compliant";
import { useProfileStore } from "../../app/store/profile/profile-store";

const complaintGroups = [
  { key: "default", get title() { return appI18n.t("ui.new"); }, get label() { return appI18n.t("ui.new_2"); }, color: "warning" },
  { key: "info", get title() { return appI18n.t("ui.in_progress"); }, get label() { return appI18n.t("ui.in_progress"); }, color: "info" },
  { key: "success", get title() { return appI18n.t("ui.accepted_plural"); }, get label() { return appI18n.t("ui.accepted_feminine"); }, color: "success" },
  { key: "error", get title() { return appI18n.t("ui.rejected_plural"); }, get label() { return appI18n.t("ui.rejected_feminine"); }, color: "error" },
];

export default function Complaints() {
  const { t } = useTranslation();
  const profileData = useProfileStore((state) => state.profileData);
  const [request, setRequest] = useState("");
  const [target, setTarget] = useState(null);
  const [files, setFiles] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({ success: true });
  const [detailMode, setDetailMode] = useState("details");
  const {
    items,
    targets,
    detail,
    selectedId,
    isLoading,
    isTargetsLoading,
    isDetailsLoading,
    isSubmitting,
    downloadingIndex,
    listError,
    targetsError,
    detailError,
    submitError,
    downloadError,
    getComplaints,
    getTargets,
    createComplaint,
    getComplaint,
    closeComplaint,
    downloadFile,
  } = useComplaintStore();
  useEffect(() => {
    getComplaints();
    getTargets();
    return () => closeComplaint();
  }, [getComplaints, getTargets, closeComplaint]);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);
  const recentItems = items.filter(
    (item) =>
      new Date(item.created_at).getTime() >=
      new Date(complaintsSince()).getTime(),
  );

  function openComplaint(id, mode) {
    setDetailMode(mode);
    getComplaint(id);
  }

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setSuccess(false);
    const validation = validateComplaint(request, files);
    setFormError(validation);
    if (validation) return;
    if (!(await createComplaint({ request, target, files }))) return;
    setRequest("");
    setTarget(null);
    setFiles([]);
    setSuccess(true);
  }

  function addFiles(event) {
    const next = [...files, ...Array.from(event.target.files || [])];
    event.target.value = "";
    const validation = validateComplaint(t("ui.description"), next);
    setFormError(validation);
    if (!validation) setFiles(next);
  }

  return (
    <RootLayout withoutDataCheck>
      <Stack spacing={3} sx={{ maxWidth: 1000, mx: "auto" }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "font_color.heading", mb: 0.5 }}
          >{t("ui.complaints")}</Typography>
          <Typography variant="body2" color="text.secondary">{t("ui.complaints_description")}</Typography>
        </Box>
        <Paper
          component="form"
          onSubmit={submit}
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(22, 36, 62, 0.04)",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "background.slate",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                p: 1.5,
                borderRadius: 2,
                bgcolor: "background.main",
                color: "primary.main",
              }}
            >
              <ChatBubbleOutlineRoundedIcon />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "font_color.heading" }}
              >{t("ui.new_complaint")}</Typography>
              <Typography variant="body2" color="text.secondary">{t("ui.complaint_form_description")}</Typography>
            </Box>
          </Stack>
          <Stack spacing={3} sx={{ p: { xs: 2, sm: 3 } }}>
            {success && <Alert severity="success">{t("ui.complaint_sent")}</Alert>}
            {(formError || submitError) && (
              <Alert severity="error">{formError || submitError}</Alert>
            )}
            {targetsError && (
              <Alert
                severity="error"
                action={<Button onClick={getTargets}>{t("ui.retry")}</Button>}
              >
                {targetsError}
              </Alert>
            )}
            <FormInput
              disabled={isSubmitting}
              label={t("ui.complaint_description")}
              placeholder={t("ui.complaint_description_hint")}
              required
              fullWidth
              multiline
              minRows={5}
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              slotProps={{
                htmlInput: { maxLength: 1000 },
                formHelperText: { sx: { textAlign: "right", mx: 0 } },
              }}
              helperText={`${request.length} / 1000`}
            />
            <Autocomplete
              options={targets}
              value={target}
              loading={isTargetsLoading}
              loadingText={t("ui.loading")}
              disabled={
                isSubmitting || isTargetsLoading || Boolean(targetsError)
              }
              onChange={(_, value) => setTarget(value)}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.type === value.type && option.id === value.id
              }
              noOptionsText={t("ui.no_recent_leads_or_factoring")}
              renderInput={(params) => (
                <FormInput
                  {...params}
                  label={t("ui.lead_or_factoring")}
                  placeholder={t("ui.select_related_lead_or_factoring")}
                  helperText={t("ui.recent_records_optional_hint")}
                />
              )}
            />
            <Box
              sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{t("ui.supporting_files")}</Typography>
                  <Typography variant="body2" color="text.secondary">{t("ui.supporting_file_formats")}</Typography>
                  <Typography variant="caption" color="text.secondary">{t("ui.complaint_files_limit", { value1: MAX_COMPLAINT_FILES })}</Typography>
                </Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileRoundedIcon />}
                  disabled={isSubmitting || files.length >= MAX_COMPLAINT_FILES}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    flexShrink: 0,
                    bgcolor: "background.paper",
                  }}
                >{t("ui.add_files")}<input
                    hidden
                    type="file"
                    multiple
                    disabled={
                      isSubmitting || files.length >= MAX_COMPLAINT_FILES
                    }
                    accept={COMPLAINT_FILE_ACCEPT}
                    onChange={addFiles}
                  />
                </Button>
              </Stack>
              {files.length > 0 && (
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {files.map((file, index) => (
                    <Chip
                      key={`${index}-${file.name}`}
                      icon={<DescriptionOutlinedIcon />}
                      label={file.name}
                      disabled={isSubmitting}
                      onDelete={() =>
                        setFiles((current) =>
                          current.filter((_, fileIndex) => fileIndex !== index),
                        )
                      }
                      sx={{
                        maxWidth: "100%",
                        alignSelf: "start",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  ))}
                  <Typography variant="caption" color="text.secondary">{t("ui.attached_files_count", { value1: files.length, value2: MAX_COMPLAINT_FILES })}</Typography>
                </Stack>
              )}
            </Box>
            <Box
              sx={{
                pt: 2.5,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <PrimaryButton
                type="submit"
                isLoading={isSubmitting}
                startIcon={!isSubmitting && <SendRoundedIcon />}
                text={isSubmitting ? t("ui.sending") : t("ui.submit_complaint")}
                sx={{ width: { xs: "100%", sm: "auto" }, px: 3 }}
              />
            </Box>
          </Stack>
        </Paper>
        <Stack spacing={2.5} sx={{ color: "font_color.heading" }}>
          <Typography variant="h6" sx={{ fontWeight: 400 }}>{t("ui.complaint_history_description")}</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography>{t("ui.total_complaints_count", { value1: recentItems.length })}</Typography>
              <Typography variant="caption" color="text.secondary">{t("ui.last_thirty_days")}</Typography>
            </Box>
            <Button
              onClick={getComplaints}
              disabled={isLoading}
              sx={{ textTransform: "none" }}
            >{t("ui.refresh")}</Button>
          </Stack>
          {isLoading && (
            <Box
              role="status"
              aria-label={t("ui.loading_complaints")}
              sx={{ display: "flex", justifyContent: "center", py: 2 }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
          {listError && (
            <Alert
              severity="error"
              action={<Button onClick={getComplaints}>{t("ui.retry")}</Button>}
            >
              {listError}
            </Alert>
          )}
          {complaintGroups.map((group) => {
            const groupItems = recentItems.filter(
              (item) => getComplaintStatus(item).color === group.key,
            );
            return (
              <Accordion
                key={group.key}
                disableGutters
                elevation={0}
                expanded={Boolean(expandedGroups[group.key])}
                onChange={(_, expanded) =>
                  setExpandedGroups((current) => ({
                    ...current,
                    [group.key]: expanded,
                  }))
                }
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "12px !important",
                  color: "inherit",
                  "&::before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreRoundedIcon />}
                  id={`complaints-${group.key}-header`}
                  aria-controls={`complaints-${group.key}-content`}
                  sx={{
                    px: 2.5,
                    minHeight: 60,
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      gap: 2,
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "1.1rem" }}>
                    {group.title}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.25,
                      minWidth: 28,
                      textAlign: "center",
                      borderRadius: 1,
                      bgcolor: "background.default",
                      color: `${group.color}.main`,
                      fontSize: 14,
                    }}
                  >
                    {groupItems.length}
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ px: { xs: 1.5, sm: 2.5 }, pb: 2.5, pt: 0.5 }}
                >
                  <Stack spacing={1.5}>
                    {groupItems.length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ py: 1 }}
                      >{t("ui.no_complaints_in_group")}</Typography>
                    )}
                    {groupItems.map((item) => (
                      <Paper
                        key={item.id}
                        variant="outlined"
                        sx={{
                          borderRadius: 2.5,
                          overflow: "hidden",
                          color: "inherit",
                          borderColor:
                            group.key === "info" ? "#b3e5fc" : "divider",
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          alignItems={{ xs: "stretch", sm: "center" }}
                          justifyContent="space-between"
                          sx={{ p: 2.5 }}
                        >
                          <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              <Typography sx={{ overflowWrap: "anywhere" }}>
                                {profileData?.personFio ||
                                  t("ui.support_request_number", { value1: item.id })}
                              </Typography>
                              <Chip
                                label={group.label}
                                color={group.color}
                                size="small"
                                sx={{
                                  borderRadius: 1,
                                  height: 24,
                                  fontSize: 12,
                                  bgcolor:
                                    group.key === "info"
                                      ? "#e6f4fd"
                                      : group.key === "success"
                                        ? "#edf5ee"
                                        : group.key === "error"
                                          ? "#fceeee"
                                          : "#fff4e5",
                                  color: `${group.color}.main`,
                                }}
                              />
                            </Box>
                            {(profileData?.companyName || item.target) && (
                              <Typography
                                variant="body2"
                                sx={{ overflowWrap: "anywhere" }}
                              >
                                {[
                                  profileData?.companyName,
                                  item.target &&
                                    getComplaintTargetLabel(item.target),
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </Typography>
                            )}
                            <Typography
                              sx={{
                                pt: 1,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.request}
                            </Typography>
                            <Typography variant="body2">
                              {dateLabel(item.created_at)}
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              display: "flex",
                              flexShrink: 0,
                              flexWrap: "wrap",
                              gap: 1,
                              "& .MuiButton-root": {
                                textTransform: "none",
                                borderRadius: 1.5,
                                borderColor: "divider",
                                color: "font_color.heading",
                              },
                            }}
                          >
                            {item.response && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() =>
                                  openComplaint(item.id, "response")
                                }
                                sx={{
                                  height: "fit-content",
                                }}
                              >{t("ui.view_response")}</Button>
                            )}
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openComplaint(item.id, "details")}
                              sx={{
                                height: "fit-content",
                              }}
                            >{t("ui.details")}</Button>
                          </Box>
                        </Stack>
                        {(item.response || group.key === "info") && (
                          <Box
                            sx={{
                              px: 2,
                              py: 1.25,
                              display: "flex",
                              gap: 1,
                              alignItems: "flex-start",
                              bgcolor:
                                group.key === "info"
                                  ? "#eaf6fc"
                                  : group.key === "error"
                                    ? "rgba(211, 47, 47, 0.07)"
                                    : "rgba(46, 125, 50, 0.07)",
                              color:
                                group.key === "info"
                                  ? "info.main"
                                  : group.key === "error"
                                    ? "error.main"
                                    : "success.main",
                            }}
                          >
                            <InfoOutlinedIcon
                              sx={{ fontSize: 18, mt: 0.25, flexShrink: 0 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere",
                              }}
                            >
                              {item.response ||
                                t("ui.complaint_under_review_hint")}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>
      </Stack>
      <Dialog
        open={selectedId !== null}
        onClose={closeComplaint}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {detailMode === "response" ? t("ui.complaint_response") : t("ui.complaint")}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {isDetailsLoading && <CircularProgress size={24} />}
            {detailError && (
              <Alert
                severity="error"
                action={
                  <Button onClick={() => getComplaint(selectedId)}>{t("ui.retry")}</Button>
                }
              >
                {detailError}
              </Alert>
            )}
            {downloadError && <Alert severity="error">{downloadError}</Alert>}
            {detail && (
              <>
                <Chip
                  {...getComplaintStatus(detail)}
                  sx={{ alignSelf: "start" }}
                />
                <Typography variant="caption">
                  {dateLabel(detail.created_at)}
                </Typography>
                {detail.target && (
                  <Typography>
                    {getComplaintTargetLabel(detail.target)}
                  </Typography>
                )}
                {detailMode === "details" && (
                  <>
                    <Typography variant="subtitle2">{t("ui.complaint_reason")}</Typography>
                    <Typography
                      sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                      {detail.request}
                    </Typography>
                  </>
                )}
                <Typography variant="subtitle2">{t("ui.response")}</Typography>
                <Typography
                  sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                >
                  {detail.response || t("ui.no_response_yet")}
                </Typography>
                {detail.acceptance_at && (
                  <Typography variant="caption">{t("ui.complaint_accepted_date", { value1: dateLabel(detail.acceptance_at) })}</Typography>
                )}
                {detail.finished_at && (
                  <Typography variant="caption">{t("ui.complaint_closed_date", { value1: dateLabel(detail.finished_at) })}</Typography>
                )}
                {(detail.files || []).map((file) => (
                  <Button
                    key={file.index}
                    disabled={downloadingIndex !== null}
                    onClick={() => downloadFile(detail.id, file)}
                    sx={{ justifyContent: "start", overflowWrap: "anywhere" }}
                  >
                    {file.name || t("ui.download_file")}
                  </Button>
                ))}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeComplaint}>{t("ui.close")}</Button>
        </DialogActions>
      </Dialog>
    </RootLayout>
  );
}
