import { Box, Checkbox, Skeleton } from "@mui/material";

const LeadsTableSkeleton = ({ rows = 10 }) => {
  const columns = [
    { width: "18%" }, // ID
    { width: "17%" }, // Статус
    { width: "8%" }, // Номер
    { width: "18%" }, // Водитель
    { width: "18%" }, // Заказчик
    { width: "21%" }, // Куда
  ];

  return (
    <Box
      sx={{
        my: 1,
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",

        "& .MuiSkeleton-root": {
          animation: "pulse 1.5s ease-in-out infinite",
        },

        "@keyframes pulse": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.35,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 1.5,
        }}
      >
        <Box
          sx={{
            width: 48,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Checkbox disabled size="small" />
        </Box>

        {columns.map((column, index) => (
          <Box
            key={index}
            sx={{
              width: column.width,
              px: 1,
            }}
          >
            <Skeleton
              variant="text"
              width={index === 5 ? "35%" : "45%"}
              height={20}
            />
          </Box>
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Box
          key={rowIndex}
          sx={{
            height: 52,
            display: "flex",
            alignItems: "center",
            px: 1.5,

            borderBottom: rowIndex !== rows - 1 ? "1px solid" : "none",

            borderColor: "divider",

            bgcolor: rowIndex % 2 === 0 ? "background.paper" : "action.hover",
          }}
        >
          {/* Checkbox */}
          <Box
            sx={{
              width: 48,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="rounded" width={18} height={18} />
          </Box>

          {/* ID */}
          <Box sx={{ width: columns[0].width, px: 1 }}>
            <Skeleton variant="text" width="75%" height={20} />
          </Box>

          {/* Status */}
          <Box sx={{ width: columns[1].width, px: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Skeleton variant="circular" width={7} height={7} />

              <Skeleton variant="text" width={90} height={20} />
            </Box>
          </Box>

          {/* Number */}
          <Box sx={{ width: columns[2].width, px: 1 }}>
            <Skeleton variant="text" width={35} height={20} />
          </Box>

          {/* Driver */}
          <Box sx={{ width: columns[3].width, px: 1 }}>
            <Skeleton
              variant="text"
              width={rowIndex % 3 === 0 ? "55%" : "35%"}
              height={20}
            />
          </Box>

          {/* Customer */}
          <Box sx={{ width: columns[4].width, px: 1 }}>
            <Skeleton
              variant="text"
              width={rowIndex % 2 === 0 ? "55%" : "35%"}
              height={20}
            />
          </Box>

          {/* Address */}
          <Box sx={{ width: columns[5].width, px: 1 }}>
            <Skeleton
              variant="text"
              width={rowIndex % 2 === 0 ? "85%" : "65%"}
              height={20}
            />
          </Box>
        </Box>
      ))}

      {/* Pagination */}
      <Box
        sx={{
          height: 52,
          px: 2,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Skeleton variant="text" width={110} height={20} />
        <Skeleton variant="text" width={70} height={20} />

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </Box>
    </Box>
  );
};

export default LeadsTableSkeleton;
