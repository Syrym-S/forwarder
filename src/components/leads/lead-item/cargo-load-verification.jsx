import React from "react";
import Section from "../../../shared/ui/section";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, Button, Typography } from "@mui/material";
import { DocumentPreview } from "../documents/DocumentPreview";
import LeadFilePreview from "./lead-file-preview";
import { useLeadsStore } from "../../../app/store/leads-store";

const CargoLoadVerification = ({
  filesFromDriver,
  isVerified,
  handleVerifyCargo,
  handleRejectCargo,
}) => {
  const isLoading = useLeadsStore((state) => state.isLoading);

  return (
    <Section title="Подтверждение погрузки">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 5,
        }}
      >
        {filesFromDriver?.map((file) => (
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
      {!isVerified && (
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
            onClick={handleVerifyCargo}
          >
            Подтвердить
          </Button>
          <Button
            disabled={isLoading}
            color="error"
            variant="outlined"
            onClick={handleRejectCargo}
          >
            Отклонить
          </Button>
        </Box>
      )}
    </Section>
  );
};

export default CargoLoadVerification;
