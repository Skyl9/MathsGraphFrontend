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
import { motion, Variants } from "framer-motion";
import LayersIcon from "@mui/icons-material/Layers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FixedSizeList as List } from "react-window";
import { useTranslation } from "react-i18next";

const TypeList = () => {
  const {
    data: types = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["type"],
    queryFn: () => nodeApi.getAllTypeNames(),
  });
  const { t } = useTranslation();

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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 800, mb: 2 }}
        >
          {t("entities.types_title")}
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : t("entities.error_occurred")}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {types.length === 0 ? (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                {t("entities.no_type_found")}
              </Typography>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <Box
                  sx={{ height: "65vh", width: "100%", bgcolor: "transparent" }}
                >
                  <List
                    height={window.innerHeight * 0.65}
                    itemCount={types.length}
                    itemSize={90}
                    width={"100%"}
                  >
                    {({ index, style }) => {
                      const typeItem = types[index];
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
                                    "0 10px 20px rgba(124, 58, 237, 0.08)",
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
                                    background: "rgba(124, 58, 237, 0.1)",
                                    color: "secondary.main",
                                  }}
                                >
                                  <LayersIcon />
                                </Box>
                                <Typography
                                  variant="h6"
                                  component="h2"
                                  sx={{
                                    fontWeight: 700,
                                    lineBreak: "anywhere",
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {typeItem.nom}
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                color="secondary"
                                href={`/type/${typeItem.id}`}
                                endIcon={<ArrowForwardIcon fontSize="small" />}
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
          </>
        )}
      </Stack>
      <ReportIssueButton />
    </Container>
  );
};

export default TypeList;
