import { ReactNode } from "react";
import { Container, Stack, Typography, Box, Alert } from "@mui/material";
import { ListSkeleton } from "../Skeletons";
import { ReportIssueButton } from "../Issue";
import { SEOMeta } from "../SEOMeta";

export interface EntityListLayoutProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  loading: boolean;
  error: Error | null;
  errorMessage: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
  seoFallback: ReactNode;
}

export const EntityListLayout = ({
  title,
  seoTitle,
  seoDescription,
  loading,
  error,
  errorMessage,
  isEmpty,
  emptyMessage,
  children,
  seoFallback,
}: EntityListLayoutProps) => {
  return (
    <>
      <SEOMeta title={seoTitle} description={seoDescription} />
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            {title}
          </Typography>

          {loading && <ListSkeleton count={6} />}

          {error && (
            <Alert severity="error">{error.message || errorMessage}</Alert>
          )}

          {!loading && !error && (
            <>
              {isEmpty ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  {emptyMessage}
                </Typography>
              ) : (
                <>
                  {children}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      overflow: "hidden",
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {seoFallback}
                  </Box>
                </>
              )}
            </>
          )}
        </Stack>
        <ReportIssueButton />
      </Container>
    </>
  );
};
