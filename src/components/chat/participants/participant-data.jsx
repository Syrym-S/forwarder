import { useLeadsStore } from "../../../app/store/leads/leads-store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  Box,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

const ParticipantData = ({ participantData, isFactoringChat }) => {
  const isParticipantLoading = useLeadsStore(
    (state) => state.isParticipantLoading,
  );

  return (
    <Stack
      spacing={1}
      sx={{
        py: 2,
        px: {
          xs: 2,
          md: 2.5,
        },
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        flexShrink: 0,
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {isParticipantLoading ? (
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "none",
              flexShrink: 0,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          participantData?.map((participant, index) =>
            participant.avatar ? (
              <Box
                key={participant.id || index}
                component="img"
                alt={participant.person_fio || "Участник чата"}
                src={participant?.avatar}
                sx={{
                  display: "block",
                  borderRadius: "100%",
                  width: "40px",
                  height: "40px",
                  objectFit: "cover",
                  boxShadow: "none",

                }}
              />
            ) : (
              <Box key={participant.id || index}
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: "none",
                  flexShrink: 0,

                }}
              >
                <PersonOutlinedIcon
                  sx={{
                    fontSize: 24,
                  }}
                />
              </Box>
            ),
          )
        )}
        <Box>
          {isParticipantLoading ? (
            <>
              <Skeleton
                variant="text"
                width={180}
                height={35}
                sx={{ mb: 0.5 }}
              />

              {!isFactoringChat && (
                <Skeleton variant="text" width={80} height={24} />
              )}
            </>
          ) : !isFactoringChat ? (
            <>
              <Typography
                sx={{
                  fontSize: {
                    xs: "1rem",
                    md: "1rem",
                  },
                }}
              >
                {participantData[0]?.person_fio}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  textTransform: "capitalize",
                  color: "text.secondary",
                }}
              >
                {participantData[0]?.role}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontSize: 16,
              }}
            >
              Чат о факторинговой покупке
            </Typography>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export default ParticipantData;
