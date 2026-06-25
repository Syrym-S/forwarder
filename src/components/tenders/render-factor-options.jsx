import { Box, Chip, Typography } from "@mui/material";

const RenderFactorOptions = ({ option, ...props }) => {
  return (
    <Box
      component="li"
      {...props}
      sx={{
        m: 1,
        border: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 0.5,
        py: 1.2,
      }}
    >
      <Typography fontWeight={700}>ФИО: {option.fio}</Typography>
      <Typography fontWeight={700}>Компания: {option.company_name}</Typography>
    </Box>
  );
};

export default RenderFactorOptions;
