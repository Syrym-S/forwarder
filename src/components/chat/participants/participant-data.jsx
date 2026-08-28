import React from "react";
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
        px: 5,
        backgroundColor: "white",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        {isParticipantLoading ? (
          <Box
            sx={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: 2,
              flexShrink: 0,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          participantData?.map((participant, index) =>
            participant.avatar ? (
              <Box
                component="img"
                src={participant?.avatar}
                sx={{
                  display: "block",
                  borderRadius: "100%",
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  boxShadow: 2,
                  transform: `translateX(-${index * 40}px)`,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 600,
                  boxShadow: 2,
                  flexShrink: 0,
                  transform: `translateX(-${index * 40}px)`,
                }}
              >
                <PersonOutlinedIcon
                  sx={{
                    fontSize: "3rem",
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
                  fontSize: "1.5rem",
                }}
              >
                {participantData[0]?.person_fio}
              </Typography>

              <Typography
                sx={{
                  fontSize: "1rem",
                  textTransform: "capitalize",
                  color: "#5c5b5b",
                }}
              >
                {participantData[0]?.role}
              </Typography>
            </>
          ) : (
            <Typography
              sx={{
                fontSize: "1.5rem",
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
