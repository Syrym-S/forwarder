import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PrimaryButton from "./button/primary-button";

const ConfirmModal = ({
  open,
  title = "Подтверждение",
  description,
  onConfirm,
  onCancel,
  isLoading,
  warning = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          border: warning ? "2px solid" : "2px solid #1f1f1f",
          borderColor: warning ? "warning.main" : "#1f1f1f",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1,
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "#263244",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {warning && (
          <WarningAmberRoundedIcon
            color="warning"
            sx={{
              fontSize: 25,
            }}
          />
        )}

        {title}
      </DialogTitle>

      <DialogContent
        sx={{
          px: 3,
          pt: "6px !important",
          pb: 1,
        }}
      >
        {warning ? (
          <Alert
            severity="warning"
            icon={false}
            sx={{
              borderRadius: "10px",
              py: 1,
              px: 1.5,

              "& .MuiAlert-message": {
                p: 0,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 400,
                lineHeight: 1.5,
              }}
            >
              {description}
            </Typography>
          </Alert>
        ) : (
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 400,
              lineHeight: 1.5,
              color: "#667892",
            }}
          >
            {description}
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pt: 2,
          pb: 2.5,
          gap: 1,
        }}
      >
        <PrimaryButton
          variant="outlined"
          isLoading={isLoading}
          onClick={onCancel}
          text="Отмена"
        />

        <PrimaryButton
          isLoading={isLoading}
          onClick={onConfirm}
          text={isLoading ? "Подтверждение" : "Подтвердить"}
        />

        {/* <Button
          disabled={isLoading}
          onClick={onConfirm}
          variant="contained"
          color={warning ? "warning" : "primary"}
          sx={{
            px: 2.5,
            py: 0.8,
            minWidth: 110,
            borderRadius: "10px",
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "none",
            gap: 1,
            boxShadow: warning
              ? "0 4px 10px rgba(237, 108, 2, 0.25)"
              : "0 4px 10px rgba(25, 103, 210, 0.25)",
          }}
        >
          {isLoading && (
            <CircularProgress
              size={13}
              sx={{
                color: "white",
              }}
            />
          )}

          {isLoading ? "Подтверждение" : "Подтвердить"}
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
