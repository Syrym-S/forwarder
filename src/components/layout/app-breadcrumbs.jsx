import { Breadcrumbs, Link, Typography } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { Link as RouterLink, useMatches, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AppBreadcrumbs() {
  const { t } = useTranslation();
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
            fontSize: {
              xs: 13,
              sm: 16,
            },
          }}
        >
          <ArrowBackIosNewRoundedIcon
            sx={{
              fontSize: {
                xs: 13,
                sm: 16,
              },
            }}
          />
          {t("common.back")}
        </Link>
      )}

      {crumbs.map((match, index) => {
        const last = index === crumbs.length - 1;

        const label = match.handle.breadcrumbKey
          ? t(match.handle.breadcrumbKey)
          : typeof match.handle.breadcrumb === "function"
            ? match.handle.breadcrumb(match)
            : match.handle.breadcrumb;

        return last ? (
          <Typography
            key={match.pathname}
            onClick={() => navigate(-1)}
            sx={{
              fontSize: {
                xs: 13,
                sm: 16,
              },
              cursor: "pointer",
            }}
          >
            {label}
          </Typography>
        ) : (
          <Link
            key={match.pathname}
            component={RouterLink}
            to={match.pathname}
            sx={{
              fontSize: {
                xs: 13,
                sm: 16,
              },
              color: "primary.main",
            }}
            underline="none"
          >
            {label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
