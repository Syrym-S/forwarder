import { Box, Chip, Typography } from "@mui/material";

export default function renderDriverOption({ key, ...props }, option) {
  return (
    <Box
      component="li"
      key={key}
      {...props}
      sx={{
        px: "16px !important",
        py: "10px !important",
        borderBottom: "1px solid",
        borderColor: "divider",
  
        display: "flex !important",
        flexDirection: "column !important",
        alignItems: "flex-start !important",
        gap: "5px !important",
  
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {option.fio || "Без имени"}
        </Typography>
  
        {option.in_black_list === true && (
          <Chip
            label="Водитель заблокирован"
            color="error"
            size="small"
          />
        )}
  
        {option.company_name && (
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: "primary.main",
              bgcolor: "primary.50",
              borderRadius: 1,
              px: 0.75,
              py: 0.2,
            }}
          >
            {option.company_name}
          </Typography>
        )}
      </Box>
  
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {option.iin && (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            ИИН:{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: 500 }}
            >
              {option.iin}
            </Box>
          </Typography>
        )}
  
        {option.phone && (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
            }}
          >
            Тел:{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: 500 }}
            >
              +{option.phone}
            </Box>
          </Typography>
        )}
  
        {option.email && (
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: 250,
            }}
          >
            {option.email}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
