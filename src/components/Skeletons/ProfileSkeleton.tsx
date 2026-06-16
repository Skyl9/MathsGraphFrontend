import { Skeleton, Box, Paper, Grid } from "@mui/material";

export const ProfileSkeleton = () => {
  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Grid container spacing={4}>
          {/* Avatar and Basic Info */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Skeleton variant="circular" width={150} height={150} />
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton
                variant="rectangular"
                width="80%"
                height={36}
                sx={{ borderRadius: 1, mt: 2 }}
              />
            </Box>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Skeleton variant="text" width="30%" height={40} />

              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Skeleton variant="text" width="20%" height={20} />
                  <Skeleton variant="text" width="100%" height={40} />
                </Box>
                <Box>
                  <Skeleton variant="text" width="20%" height={20} />
                  <Skeleton variant="text" width="100%" height={40} />
                </Box>
                <Box>
                  <Skeleton variant="text" width="20%" height={20} />
                  <Skeleton variant="text" width="100%" height={40} />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
