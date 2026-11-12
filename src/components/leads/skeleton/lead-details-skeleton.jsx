import { Box, Skeleton, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import Section from "../lead-item/lead-detail-section";

const SkeletonFields = ({ count, columns = { xs: "1fr", sm: "1fr 1fr" } }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: columns, gap: 1.5 }}>
    {Array.from({ length: count }, (_, index) => (
      <Box key={index} sx={{ minWidth: 0 }}>
        <Skeleton animation="wave" width="45%" height={20} />
        <Skeleton animation="wave" width="75%" height={28} />
      </Box>
    ))}
  </Box>
);

const SkeletonSection = ({ children }) => (
  <Section
    icon={<Skeleton animation="wave" variant="rounded" width={24} height={24} />}
    title={<Skeleton animation="wave" width={160} height={24} />}
  >
    {children}
  </Section>
);

const LeadDetailsSkeleton = () => {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      aria-label={t("ui.loading")}
      aria-busy="true"
      sx={{ maxWidth: 1440, width: "100%", minWidth: 0, mx: "auto" }}
    >
      <Box aria-hidden="true">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ width: 320, maxWidth: "100%" }}>
            <Skeleton animation="wave" width="65%" height={36} />
            <Skeleton animation="wave" width="100%" height={22} />
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Skeleton animation="wave" variant="rounded" width={120} height={40} />
            <Skeleton animation="wave" variant="rounded" width={120} height={40} />
          </Stack>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 1.5,
            p: 1,
            my: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {[140, 120, 120, 120].map((width, index) => (
              <Skeleton
                key={index}
                animation="wave"
                variant="rounded"
                width={width}
                height={40}
                sx={{ maxWidth: "100%" }}
              />
            ))}
          </Box>
          <Skeleton animation="wave" variant="rounded" width={40} height={40} />
        </Box>

        <Box sx={{ py: 1 }} />
        <Skeleton
          animation="wave"
          variant="rounded"
          height={400}
          sx={{ my: 2, borderRadius: 3 }}
        />

        <SkeletonSection>
          <Stack spacing={2}>
            {[0, 1].map((index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={32}
                  height={32}
                  sx={{ flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton animation="wave" width="25%" height={20} />
                  <Skeleton animation="wave" width="65%" height={28} />
                </Box>
              </Box>
            ))}
            <SkeletonFields count={1} columns="1fr" />
          </Stack>
        </SkeletonSection>

        <SkeletonSection>
          <Box sx={{ mb: 2 }}>
            <SkeletonFields count={2} />
          </Box>
          <SkeletonFields
            count={4}
            columns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }}
          />
        </SkeletonSection>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", xl: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
            minHeight: 250,
          }}
        >
          {[0, 1].map((index) => (
            <SkeletonSection key={index}>
              <SkeletonFields count={6} />
            </SkeletonSection>
          ))}
        </Box>

        <SkeletonSection>
          <SkeletonFields count={4} />
        </SkeletonSection>
        <SkeletonSection>
          <Skeleton animation="wave" variant="rounded" height={80} />
        </SkeletonSection>
      </Box>
    </Box>
  );
};

export default LeadDetailsSkeleton;
