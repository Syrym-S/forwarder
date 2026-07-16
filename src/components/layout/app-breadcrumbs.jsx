import { Breadcrumbs, Link, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link as RouterLink, useMatches, useNavigate } from "react-router-dom";

export default function AppBreadcrumbs() {
  const matches = useMatches();
  const navigate = useNavigate();

  const crumbs = matches.filter((match) => match.handle?.breadcrumb);

  return (
    <Breadcrumbs>
      {crumbs.length > 1 && (
        <Link
          component="button"
          underline="hover"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
          }}
        >
          <ArrowBackIosNewRoundedIcon sx={{ fontSize: 16 }} />
          Назад
        </Link>
      )}

      {crumbs.map((match, index) => {
        const last = index === crumbs.length - 1;

        const label =
          typeof match.handle.breadcrumb === "function"
            ? match.handle.breadcrumb(match)
            : match.handle.breadcrumb;

        return last ? (
          <Typography key={match.pathname}>{label}</Typography>
        ) : (
          <Link
            key={match.pathname}
            component={RouterLink}
            to={match.pathname}
            underline="hover"
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
