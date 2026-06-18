import {
  Container,
  Typography,
  Stack,
  Box,
  Alert,
  Card,
  Button,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { motion } from "framer-motion";
import { getStaggerContainer, fadeInUp } from "../utils/animations";
import FunctionsIcon from "@mui/icons-material/Functions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FixedSizeList as List } from "react-window";
import { useTranslation } from "react-i18next";
import { ListSkeleton } from "../components/Skeletons";
import { SEOMeta } from "../components/SEOMeta";

const ConceptList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    data: concepts = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["concept"],
    queryFn: () => nodeApi.getAllConceptNames(),
  });
  const { t } = useTranslation();

  const containerVariants = getStaggerContainer(0.05);
  const itemVariants = fadeInUp;

  return (
    <>
      <SEOMeta
        title={t("entities.concepts_title") || "Concepts"}
        description="Explorez tous les concepts mathématiques, théorèmes et définitions de MathGraph."
      />
      <Container component="main" maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Typography
            variant="h3"
            component="h1"
            textAlign="center"
            sx={{ fontWeight: 800, mb: 2 }}
          >
            {t("entities.concepts_title")}
          </Typography>

          {loading && <ListSkeleton count={6} />}

          {error && (
            <Alert severity="error">
              {error instanceof Error
                ? error.message
                : t("entities.error_occurred")}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {concepts.length === 0 ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  {t("entities.no_concept_found")}
                </Typography>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Box
                    sx={{
                      height: "65vh",
                      width: "100%",
                      bgcolor: "transparent",
                    }}
                  >
                    <List
                      height={window.innerHeight * 0.65}
                      itemCount={concepts.length}
                      itemSize={90}
                      width={"100%"}
                    >
                      {({ index, style }) => {
                        const concept = concepts[index];
                        return (
                          <div style={{ ...style, paddingBottom: "16px" }}>
                            <motion.div
                              variants={itemVariants}
                              style={{ height: "100%" }}
                            >
                              <Card
                                className="glass-card"
                                elevation={0}
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  background: isDark
                                    ? "rgba(15, 20, 40, 0.7)"
                                    : "rgba(255, 255, 255, 0.7)",
                                  backdropFilter: "blur(8px)",
                                  border: isDark
                                    ? "1px solid rgba(255, 255, 255, 0.05)"
                                    : "1px solid rgba(0, 0, 0, 0.06)",
                                  borderRadius: 4,
                                  p: 2,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 10px 20px rgba(14, 165, 233, 0.08)",
                                    borderColor: "primary.main",
                                  },
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: 2,
                                      background: "rgba(14, 165, 233, 0.1)",
                                      color: "primary.main",
                                    }}
                                  >
                                    <FunctionsIcon />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    component="h2"
                                    sx={{
                                      fontWeight: 700,
                                      lineBreak: "anywhere",
                                    }}
                                  >
                                    {concept.nom}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  href={`/concept/${concept.id}`}
                                  endIcon={
                                    <ArrowForwardIcon fontSize="small" />
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  {t("entities.view")}
                                </Button>
                              </Card>
                            </motion.div>
                          </div>
                        );
                      }}
                    </List>
                  </Box>
                </motion.div>
              )}

              {/* Fallback statique caché pour l'indexation SEO */}
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
                <ul>
                  {concepts.map((c) => (
                    <li key={`seo-${c.id}`}>
                      <a href={`/concept/${c.id}`}>{c.nom}</a>
                    </li>
                  ))}
                </ul>
              </Box>
            </>
          )}
        </Stack>
        <ReportIssueButton />
      </Container>
    </>
  );
};

export default ConceptList;
