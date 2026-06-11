import { Box, Chip, DialogTitle, Typography } from "@mui/material";

const LeadFormHeader = ({ isEdit = false, activeStep, steps }) => {
  return (
    <DialogTitle>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
              },
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {isEdit ? "Редактирование маршрута" : "Создание маршрута"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Заполните данные по заявке
          </Typography>
        </Box>

        <Chip
          label={`Шаг ${activeStep} из ${steps.length}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor: "rgba(33, 150, 243, 0.04)",
          }}
        />
      </Box>
    </DialogTitle>
  );
};

export default LeadFormHeader;
