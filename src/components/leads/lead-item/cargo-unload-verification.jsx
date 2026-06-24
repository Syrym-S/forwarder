import React from "react";
import Section from "../../../shared/ui/section";
import { Box, Button, Typography } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";

const CargoUnloadVerification = ({
  isUnloadVerified,
  filesFromDriverToUnload,
  handleVerifyCargoUnload,
  handleRejectCargoUnload,
}) => {
  const isLoading = useLeadsStore((state) => state.isLoading);

  return (
    <Section
      icon={
        isUnloadVerified ? (
          <TaskAltOutlinedIcon color="success" />
        ) : (
          <NewReleasesIcon color="primary" />
        )
      }
      title={
        isUnloadVerified ? "Разгрузка подтверждена" : "Подтверждение разгрузки"
      }
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 5,
        }}
      >
        {filesFromDriverToUnload?.map((file) => (
          <Box
            component="button"
            type="button"
            sx={{
              p: 1.5,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
              backgroundColor: "grey.50",
              textAlign: "left",
              color: "inherit",
              cursor: "pointer",
              transition: "0.2s ease",
              font: "inherit",
              "&:hover": {
                borderColor: "primary.light",
                backgroundColor: "rgba(33, 150, 243, 0.04)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <InsertDriveFileOutlinedIcon
                  sx={{
                    color: "common.white",
                    fontSize: 24,
                  }}
                />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: 1.35,
                  }}
                >
                  {file.name || "Документ"}
                </Typography>
              </Box>
            </Box>

            {/* <LeadFilePreview file={file}/> */}
            {/* <DocumentPreview document={file} /> */}
          </Box>
        ))}
      </Box>
      {!isUnloadVerified && (
        <Box
          sx={{
            my: 1,
            display: "flex",
            gap: 5,
          }}
        >
          <Button
            disabled={isLoading}
            color="success"
            variant="outlined"
            onClick={handleVerifyCargoUnload}
          >
            Подтвердить
          </Button>
          <Button
            disabled={isLoading}
            color="error"
            variant="outlined"
            onClick={handleRejectCargoUnload}
          >
            Отклонить
          </Button>
        </Box>
      )}
    </Section>
  );
};

export default CargoUnloadVerification;
