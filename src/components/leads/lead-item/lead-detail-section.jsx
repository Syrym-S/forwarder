import { Box, Paper, Typography } from "@mui/material";

const Section = ({ icon, title, children }) => (
  <Paper
    className="lead-detail-section"
    elevation={0}
    sx={theme => ({
      boxShadow: "none",
      minWidth: 0,
      "& .MuiTypography-root": {
        overflowWrap: "anywhere"
      },
      "& .MuiButton-root": {
        textTransform: "none",
        borderRadius: 2
      },
      p: {
        xs: 2,
        sm: 2.5
      },
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      mb: 2,
      [theme.breakpoints.down("sm")]: {
        ".lead-details-page &": {
          padding: "14px",
          marginBottom: "12px",
          borderColor: "#e2e8f0",
          borderRadius: "18px",
          boxShadow: "0 3px 12px rgb(15 23 42 / 3%)",
          "& .MuiButton-root": {
            minHeight: "40px",
            maxWidth: "100%",
            fontSize: "12px"
          }
        }
      }
    })}
  >
    <Box
      className="lead-detail-section-heading"
      sx={theme => ({
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2,
        [theme.breakpoints.down("sm")]: {
          ".lead-details-page &": {
            gap: "10px",
            marginBottom: "12px"
          }
        }
      })}
    >
      <Box
        className="lead-detail-section-icon"
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          borderRadius: 2,
          bgcolor: "background.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        className="lead-detail-section-title"
        sx={theme => ({
          fontWeight: 600,
          color: "font_color.heading",
          fontSize: 16,
          [theme.breakpoints.down("sm")]: {
            ".lead-details-page &": {
              minWidth: "0",
              fontSize: "15px",
              lineHeight: "1.4",
              "& .MuiTypography-root": {
                fontSize: "inherit"
              }
            }
          }
        })}
      >
        {title}
      </Typography>
    </Box>

    {children}
  </Paper>
);

export default Section;
