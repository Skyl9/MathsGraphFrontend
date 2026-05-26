import { Container, Typography, Stack, CircularProgress, Box, Alert, Card, CardContent, Button, Grid, Chip } from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { motion, Variants } from "framer-motion";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Category } from "../types/ApiTypes/category";

interface CategoryTree extends Category {
  children: CategoryTree[];
}

function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const nodes = new Map<number, CategoryTree>();
  categories.forEach(cat =>
    nodes.set(cat.id, { ...cat, children: [] })
  );
  const roots: CategoryTree[] = [];
  nodes.forEach(node => {
    if (node.parent_id != null && nodes.has(Number(node.parent_id))) {
      nodes.get(Number(node.parent_id))!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  roots.sort((a, b) => a.nom.localeCompare(b.nom));
  roots.forEach(r =>
    r.children.sort((a, b) => a.nom.localeCompare(b.nom))
  );
  return roots;
}

const CategoryList = () => {
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => nodeApi.getAllCategories()
  });

  const categoryTree = buildCategoryTree(categories);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Typography variant="h3" component="h1" textAlign="center" sx={{ fontWeight: 800, mb: 2 }}>
          Catégories de Concepts
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error">{error instanceof Error ? error.message : "Une erreur est survenue"}</Alert>}

        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <Typography variant="body1" color="textSecondary" textAlign="center">
                Aucune catégorie trouvée.
              </Typography>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <Grid container spacing={3}>
                  {categoryTree.map((rootCat) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={rootCat.id}>
                      <motion.div variants={itemVariants} style={{ height: "100%" }}>
                        <Card 
                          className="glass-card" 
                          elevation={0}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            background: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(0, 0, 0, 0.06)",
                            borderRadius: 4,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 10px 20px rgba(14, 165, 233, 0.08)",
                              borderColor: "primary.main",
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3, pb: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                              <Box 
                                sx={{ 
                                  width: 40, 
                                  height: 40, 
                                  display: "flex", 
                                  alignItems: "center", 
                                  justifyContent: "center", 
                                  borderRadius: 2, 
                                  background: "rgba(14, 165, 233, 0.1)", 
                                  color: "primary.main"
                                }}
                              >
                                <FolderOpenIcon />
                              </Box>
                              <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                                {rootCat.nom}
                              </Typography>
                            </Stack>

                            {rootCat.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {rootCat.description}
                              </Typography>
                            )}

                            {rootCat.children.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "block", mb: 1, textTransform: "uppercase" }}>
                                  Sous-catégories :
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                  {rootCat.children.map((child) => (
                                    <Chip
                                      key={child.id}
                                      label={child.nom}
                                      component="a"
                                      href={`/category/${child.id}`}
                                      clickable
                                      variant="outlined"
                                      size="small"
                                      sx={{ 
                                        borderRadius: 1.5,
                                        "&:hover": {
                                          background: "rgba(14, 165, 233, 0.08) !important",
                                          color: "primary.main",
                                          borderColor: "primary.main"
                                        }
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                          <Box sx={{ p: 3, pt: 1 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              href={`/category/${rootCat.id}`}
                              fullWidth
                              endIcon={<ArrowForwardIcon fontSize="small" />}
                              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                            >
                              Parcourir la Catégorie Mère
                            </Button>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </>
        )}
      </Stack>
      <ReportIssueButton />
    </Container>
  );
};

export default CategoryList;
