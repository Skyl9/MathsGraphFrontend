import { Box, Chip, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { GenericEntityList } from "../components/EntityList/GenericEntityList";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { Category } from "../types/ApiTypes/category";
import { useTranslation } from "react-i18next";

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

  return (
    <GenericEntityList
      title={t("entities.categories_title") || "Catégories"}
      seoTitle={t("categories.title") || "Catégories"}
      seoDescription="Parcourez la liste de toutes les catégories mathématiques répertoriées dans MathGraph."
      loading={loading}
      error={error as Error}
      errorMessage={t("entities.error_occurred")}
      emptyMessage={t("entities.no_category_found")}
      seoFallback={
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
      }
      items={categoryTree}
      itemSize={220}
      renderCardProps={(rootCat) => ({
        title: rootCat.nom,
        icon: <FolderOpenIcon />,
        actionTo: `/category/${rootCat.id}`,
        actionText: t("entities.browse"),
        isSecondary: false,
        children: (
          <>
            {rootCat.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {rootCat.description}
              </Typography>
            )}
            {rootCat.children.length > 0 && (
              <Box sx={{ mt: "auto", overflowY: "auto", maxHeight: 80 }}>
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
                    />
                  ))}
                </Box>
              </Box>
            )}
          </>
        ),
      })}
    />
  );
};

export default CategoryList;
