import { Box, Chip, Stack, Typography } from "@mui/material";
import FactoringLineInfo from "../factoring/factoring-line-info";

const RenderFactorOptions = ({ option, ...props }) => {
  const isSettingsExist = option?.factor_setting;

  const approvedLine = option?.lines?.find(
    (line) => line.status === "approved",
  );
  const newLine = option?.lines?.find((line) => line.status === "new");

  const isLinesExist = approvedLine || newLine;

  return (
    <Box
      {...props}
      sx={{
        ...props.sx,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        px: 1.5,
        py: 1,
        "&:hover": {
          backgroundColor: "action.hover",
          borderColor: "primary.main",
        },
      }}
    >
      <Stack
        spacing={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          alignItems: "start",
          width: "50%",
        }}
      >
        <Typography variant="body2" fontWeight={600} color="text.primary">
          {option.company_name}
        </Typography>
        <Typography variant="body2" fontWeight={600} color="text.primary">
          БИН: {option.company_bin}
        </Typography>
      </Stack>

      <Stack
        spacing={1}
        sx={{
          py: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          width: "50%",
        }}
      >
        <Chip
          sx={{
            width: "fit-content",
          }}
          label={isLinesExist || !isSettingsExist ? "Открыт" : "Закрыт"}
          color={isLinesExist || !isSettingsExist ? "primary" : "error"}
          variant="outlined"
          size="small"
        />
        {isLinesExist && <FactoringLineInfo line={approvedLine || newLine} />}
      </Stack>
    </Box>
  );
};

export default RenderFactorOptions;
