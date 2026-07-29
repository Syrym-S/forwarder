import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  Typography,
  Stack,
  TextField,
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
  const registrationDocument =
    legalDocuments?.find((document) => document.context === "registration") ||
    {};
  const employerDocument =
    legalDocuments?.find((document) => document.context === "employer") || {};

  return (
    <Stack spacing={2}>
      <Typography fontWeight={600}>Документ</Typography>

      <Controller
        control={control}
        name="personDocumentNumber"
        render={({ field }) => (
          <TextField
            {...field}
            label="Номер документа"
            type="number"
            // value={form.companyName}.
            // onChange={handleChange}
            // error={Boolean(errors.companyName)}
            // helperText={errors.companyName}
            fullWidth
          />
        )}
      />

      <Controller
        control={control}
        name="personIssueCountry"
        render={({ field }) => (
          <TextField
            {...field}
            label="Страна"
            // value={form.personIssueCountry}
            // onChange={handleChange}
            // error={Boolean(errors.personIssueCountry)}
            // helperText={errors.personIssueCountry}
            sx={{
              textTransform: "uppercase",
            }}
            fullWidth
          />
        )}
      />

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
              >
                Документ о регистрации юридического лица
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Заменить документ
                <input
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
              <IconButton
                disabled={isSubmitting}
                color="error"
                onClick={() => {
                  setRegistrationDocumentsToUpload(null);
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
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
              >
                Документ о трудоустройстве сотрудника
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
              >
                Заменить документ
                <input
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

              <IconButton
                disabled={isSubmitting}
                color="error"
                onClick={() => {
                  setValue("employer_document", null);
                  setEmployerDocumentToUpload(null);
                }}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Box>
          )}

          {/* {error && <FormHelperText error>{error.message}</FormHelperText>} */}
        </Box>
      </Box>
    </Stack>
  );
};

export default EditDocumentDetails;
