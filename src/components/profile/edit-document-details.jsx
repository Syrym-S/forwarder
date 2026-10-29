import { useTranslation } from "react-i18next";
import TooltipIconButton from "../../shared/ui/tooltip-icon-button";
import {
  Box,
  Button,
  FormHelperText,
  Typography,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LegalDocumentViewer from "./legal-document-viewer";

const EditDocumentDetails = ({
  control,
  setValue,
  legalDocuments,
  registrationDocumentsToUpload,
  employerDocumentToUpload,
  setRegistrationDocumentsToUpload,
  setEmployerDocumentToUpload,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const today = new Date();
  const maxIssueDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const registrationDocument =
    legalDocuments?.find((document) => document.context === "registration") ||
    {};
  const employerDocument =
    legalDocuments?.find((document) => document.context === "employer") || {};

  const signContract =
    legalDocuments?.find((document) => document.context === "contract") || null;

  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>{t("ui.document")}</Typography>

      <Controller
        control={control}
        name="personDocumentNumber"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.document_number")}
            type="number"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="personIssueCountry"
        render={({ field }) => (
          <TextField
            {...field}
            label={t("ui.country")}
            // value={form.personIssueCountry}
            // onChange={handleChange}
            // error={Boolean(errors.personIssueCountry)}
            // helperText={errors.personIssueCountry}

            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        )}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        <Controller
          name="personDocumentIssueDate"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              label={t("ui.document_issue_date_2")}
              type="date"
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || t("ui.issue_date_not_in_future")}
              slotProps={{
                htmlInput: { max: maxIssueDate },
                inputLabel: { shrink: true, required: true },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          )}
        />
        <Controller
          name="personDocumentIssuedBy"
          control={control}
          defaultValue=""
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              select
              label={t("ui.document_issued_by")}
              fullWidth
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message || t("ui.select_issuing_authority")}
              slotProps={{ inputLabel: { required: true } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            >
              <MenuItem value="МЮ РК">{t("ui.kazakhstan_ministry_of_justice")}</MenuItem>
              <MenuItem value="МВД РК">{t("ui.kazakhstan_ministry_of_internal_affairs")}</MenuItem>
            </TextField>
          )}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 1,
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            my: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            transition: "0.2s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack>
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "1rem",
                  lineHeight: 1.4375,
                  letterSpacing: "0.00938em",
                  fontWeight: 400,
                }}
              >{t("ui.legal_entity_registration_document")}</Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >{t("ui.replace_document")}<input
                  hidden
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => {
                    console.log(event.target.files);
                    setRegistrationDocumentsToUpload(event.target.files);
                  }}
                />
              </Button>
            </Stack>

            {registrationDocument && (
              <LegalDocumentViewer file={registrationDocument} />
            )}
          </Box>

          {registrationDocumentsToUpload && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              {registrationDocumentsToUpload[0]?.type?.startsWith("image/") ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(registrationDocumentsToUpload[0])}
                  alt={registrationDocumentsToUpload[0].name}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                >
                  <InsertDriveFileOutlinedIcon
                    color="primary"
                    fontSize="large"
                  />
                </Box>
              )}
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  noWrap
                  title={registrationDocumentsToUpload[0].name}
                >
                  {registrationDocumentsToUpload[0].name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {(
                    registrationDocumentsToUpload[0].size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </Typography>
              </Box>
              <TooltipIconButton
                title={t("ui.delete_document")}
                aria-label={t("ui.delete_document")}
                disabled={isSubmitting}
                color="error"
                onClick={() => {
                  setRegistrationDocumentsToUpload(null);
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </TooltipIconButton>
            </Box>
          )}

          {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
        </Box>

        <Box
          sx={{
            border: "1px solid",
            my: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            transition: "0.2s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack>
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "1rem",
                  lineHeight: 1.4375,
                  letterSpacing: "0.00938em",
                  fontWeight: 400,
                }}
              >{t("ui.employee_employment_document")}</Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >{t("ui.replace_document")}<input
                  hidden
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => {
                    console.log("event", event.target.files);
                    setEmployerDocumentToUpload(event.target.files);
                  }}
                />
              </Button>
            </Stack>

            {employerDocument && (
              <LegalDocumentViewer file={employerDocument} />
            )}
          </Box>

          {employerDocumentToUpload && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
              }}
            >
              {employerDocumentToUpload[0].type.startsWith("image/") ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(employerDocumentToUpload[0])}
                  alt={employerDocumentToUpload[0].name}
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                >
                  <InsertDriveFileOutlinedIcon
                    color="primary"
                    fontSize="large"
                  />
                </Box>
              )}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  noWrap
                  title={employerDocumentToUpload[0].name}
                >
                  {employerDocumentToUpload[0].name}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {(employerDocumentToUpload[0].size / 1024 / 1024).toFixed(2)}{" "}
                  MB
                </Typography>
              </Box>

              <TooltipIconButton
                title={t("ui.delete_document")}
                aria-label={t("ui.delete_document")}
                disabled={isSubmitting}
                color="error"
                onClick={() => {
                  setValue("employer_document", null);
                  setEmployerDocumentToUpload(null);
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </TooltipIconButton>
            </Box>
          )}

          {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
        </Box>
      </Box>

      {signContract && (
        <Box
          sx={{
            border: "1px solid",
            my: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            transition: "0.2s",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack>
              <Typography
                sx={{
                  color: "rgba(0, 0, 0, 0.6)",
                  fontSize: "1rem",
                  lineHeight: 1.4375,
                  letterSpacing: "0.00938em",
                  fontWeight: 400,
                }}
              >{t("ui.contract_signing_document")}</Typography>
            </Stack>

            <LegalDocumentViewer file={signContract} />
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default EditDocumentDetails;
