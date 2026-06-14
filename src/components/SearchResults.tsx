import {
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FunctionsIcon from "@mui/icons-material/Functions";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";

interface SearchResult {
  id: number | string;
  nom: string;
  entity_type: string;
  extrait?: string;
}

interface Props {
  results: SearchResult[];
  isDark: boolean;
}

export const SearchResults = ({ results, isDark }: Props) => {
  return (
    <Grid container spacing={3}>
      {results.map((item, index) => {
        const isConcept = item.entity_type === "concept";
        const isMath = item.entity_type === "mathematicien";

        return (
          <Grid size={{ xs: 12, sm: 6 }} key={item.id} sx={{ display: "flex" }}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.05, 0.3),
              }}
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                  transition:
                    "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "primary.main",
                    boxShadow: isDark
                      ? "0 12px 30px rgba(0,0,0,0.25)"
                      : "0 12px 30px rgba(0,0,0,0.04)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    pb: 1,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={2}
                  >
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: isConcept
                          ? "rgba(14, 165, 233, 0.15)"
                          : isMath
                            ? "rgba(139, 92, 246, 0.15)"
                            : "rgba(249, 115, 22, 0.15)",
                        color: isConcept
                          ? "#0ea5e9"
                          : isMath
                            ? "#8b5cf6"
                            : "#f97316",
                        display: "inline-flex",
                      }}
                    >
                      {isConcept ? (
                        <FunctionsIcon />
                      ) : isMath ? (
                        <PeopleIcon />
                      ) : (
                        <CategoryIcon />
                      )}
                    </Box>
                    <Chip
                      size="small"
                      label={
                        isConcept
                          ? "Concept"
                          : isMath
                            ? "Mathématicien"
                            : "Catégorie"
                      }
                      color={
                        isConcept ? "info" : isMath ? "secondary" : "warning"
                      }
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        height: 20,
                        borderRadius: 1.5,
                      }}
                    />
                  </Box>

                  <Link
                    to={`/${item.entity_type}/${item.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        mb: 1.5,
                        lineHeight: 1.3,
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {item.nom}
                    </Typography>
                  </Link>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      flexGrow: 1,
                    }}
                  >
                    {item.extrait || "Aucune description disponible..."}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    href={`/${item.entity_type}/${item.id}`}
                    sx={{
                      fontWeight: 700,
                      textTransform: "none",
                      p: 0,
                      "&:hover": { bgcolor: "transparent" },
                    }}
                  >
                    Consulter la fiche →
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};
