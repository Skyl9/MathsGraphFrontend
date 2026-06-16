import { Skeleton, Grid, Card, CardContent } from "@mui/material";

interface ListSkeletonProps {
  count?: number;
}

export const ListSkeleton = ({ count = 6 }: ListSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <Card
            sx={{
              height: "100%",
              minHeight: 180,
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Titre simulé */}
              <Skeleton variant="text" width="80%" height={32} />

              {/* Corps simulé */}
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="90%" height={20} />
              <Skeleton variant="text" width="95%" height={20} />

              {/* Espace flexible */}
              <div style={{ flexGrow: 1 }} />

              {/* Pied de carte simulé (bouton/lien) */}
              <Skeleton
                variant="rectangular"
                width="40%"
                height={36}
                sx={{ borderRadius: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
