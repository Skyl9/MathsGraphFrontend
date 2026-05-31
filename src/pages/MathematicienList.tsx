import {
  Container,
  Typography,
  Stack,
  CircularProgress,
  Box,
  Alert,
  Card,
  Button,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { MathematicianTimeline } from "../components/MathematicianTimeline.tsx";
import { motion, Variants } from "framer-motion";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FixedSizeList as List } from "react-window";

const MathematicienList = () => {
  const {
    data: mathematicians = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["mathematicien"],
    queryFn: () => nodeApi.getAllMathematicienName(),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <>
      {/* Chronologie en haut */}
      <MathematicianTimeline />

      {/* Liste complète sous forme de liste virtuelle */}
      <Container maxWidth="lg" sx={{ mt: 6, pb: 6 }}>
        <Stack spacing={4}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ fontWeight: 800 }}
          >
            Tous les Mathématiciens
          </Typography>

          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error">
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue"}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {mathematicians.length === 0 ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  Aucun Mathématicien trouvé.
                </Typography>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Box
                    sx={{
                      height: "60vh",
                      width: "100%",
                      bgcolor: "transparent",
                    }}
                  >
                    <List
                      height={window.innerHeight * 0.6}
                      itemCount={mathematicians.length}
                      itemSize={90}
                      width={"100%"}
                    >
                      {({ index, style }) => {
                        const math = mathematicians[index];
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
                                  background: "rgba(255, 255, 255, 0.7)",
                                  backdropFilter: "blur(8px)",
                                  border: "1px solid rgba(0, 0, 0, 0.06)",
                                  borderRadius: 4,
                                  p: 2,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 10px 20px rgba(139, 92, 246, 0.08)",
                                    borderColor: "secondary.main",
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
                                      background: "rgba(139, 92, 246, 0.1)",
                                      color: "secondary.main",
                                    }}
                                  >
                                    <AccountCircleIcon />
                                  </Box>
                                  <Typography
                                    variant="h6"
                                    component="h3"
                                    sx={{
                                      fontWeight: 700,
                                      lineBreak: "anywhere",
                                    }}
                                  >
                                    {math.nom}
                                  </Typography>
                                </Box>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  href={`/mathematicien/${math.id}`}
                                  endIcon={
                                    <ArrowForwardIcon fontSize="small" />
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  Consulter
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
            </>
          )}
        </Stack>
        <ReportIssueButton />
      </Container>
    </>
  );
};

export default MathematicienList;
