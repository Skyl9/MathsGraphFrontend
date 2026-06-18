import {
  Container,
  Typography,
  Stack,
  Box,
  Alert,
  Card,
  Button,
  Chip,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { motion } from "framer-motion";
import { getStaggerContainer, fadeInUp } from "../utils/animations";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Category } from "../types/ApiTypes/category";
import { FixedSizeList as List } from "react-window";
import { useTranslation } from "react-i18next";
import { ListSkeleton } from "../components/Skeletons";

interface CategoryTree extends Category {
  children: CategoryTree[];
}

function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const nodes = new Map<number, CategoryTree>();
  categories.forEach((cat) => nodes.set(cat.id, { ...cat, children: [] }));
  const roots: CategoryTree[] = [];
  nodes.forEach((node) => {
    if (node.parent_id != null && nodes.has(Number(node.parent_id))) {
      nodes.get(Number(node.parent_id))!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  roots.sort((a, b) => a.nom.localeCompare(b.nom));
  roots.forEach((r) => r.children.sort((a, b) => a.nom.localeCompare(b.nom)));
  return roots;
}

const CategoryList = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => nodeApi.getAllCategories(),
  });
  const { t } = useTranslation();

  const categoryTree = buildCategoryTree(categories);

  const containerVariants = getStaggerContainer(0.05);
  const itemVariants = fadeInUp;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Typography
          variant="h3"
          component="h1"
          textAlign="center"
          sx={{ fontWeight: 800, mb: 2 }}
        >
          {t("entities.categories_title")}
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
            {categories.length === 0 ? (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                {t("entities.no_category_found")}
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
                    itemCount={categoryTree.length}
                    itemSize={220}
                    width={"100%"}
                  >
                    {({ index, style }) => {
                      const rootCat = categoryTree[index];
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
                                  flex: 1,
                                  pr: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                  sx={{ mb: 1 }}
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
                                    <FolderOpenIcon />
                                  </Box>
                                  <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{ fontWeight: 700 }}
                                  >
                                    {rootCat.nom}
                                  </Typography>
                                </Stack>
                                {rootCat.description && (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    {rootCat.description}
                                  </Typography>
                                )}
                                {rootCat.children.length > 0 && (
                                  <Box
                                    sx={{
                                      mt: "auto",
                                      overflowY: "auto",
                                      maxHeight: 80,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                      }}
                                    >
                                      {rootCat.children.map((child) => (
                                        <Chip
                                          key={child.id}
                                          label={child.nom}
                                          component="a"
                                          href={`/category/${child.id}`}
                                          clickable
                                          variant="outlined"
                                          size="small"
                                        />
                                      ))}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  href={`/category/${rootCat.id}`}
                                  endIcon={
                                    <ArrowForwardIcon fontSize="small" />
                                  }
                                  sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    height: "fit-content",
                                  }}
                                >
                                  {t("entities.browse")}
                                </Button>
                              </Box>
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
                {categoryTree.map((rootCat) => (
                  <li key={`seo-${rootCat.id}`}>
                    <a href={`/category/${rootCat.id}`}>{rootCat.nom}</a>
                    {rootCat.children && rootCat.children.length > 0 && (
                      <ul>
                        {rootCat.children.map((child) => (
                          <li key={`seo-child-${child.id}`}>
                            <a href={`/category/${child.id}`}>{child.nom}</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </Box>
          </>
        )}
      </Stack>
      <ReportIssueButton />
    </Container>
  );
};

export default CategoryList;
