import React from "react";
import {
  Container,
  Typography,
  Stack,
  CircularProgress,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  Link
} from "@mui/material";
import { useQuery } from '@tanstack/react-query';
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import { ReportIssueButton } from "../components/Issue";
import { Category } from "../types/ApiTypes/category";

// structure enrichie pour le tree
interface CategoryTree extends Category {
  children: CategoryTree[];
}

function buildCategoryTree(categories: Category[]): CategoryTree[] {
  const nodes = new Map<number, CategoryTree>();
  // 1) création de tous les nœuds
  categories.forEach(cat =>
    nodes.set(cat.id, { ...cat, children: [] })
  );
  const roots: CategoryTree[] = [];
  // 2) rattachement ou racine
  nodes.forEach(node => {
    if (node.parent_id != null && nodes.has(Number(node.parent_id))) {
      nodes.get(Number(node.parent_id))!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  // facultatif : tri alphabétique
  roots.sort((a, b) => a.nom.localeCompare(b.nom));
  roots.forEach(r =>
    r.children.sort((a, b) => a.nom.localeCompare(b.nom))
  );
  return roots;
}

const renderTree = (cats: CategoryTree[], level = 0) =>
  cats.map(cat => (
    <React.Fragment key={cat.id}>
      <ListItem sx={{ pl: level * 3 }}>
        <ListItemText>
          <Link
            href={`/category/${cat.id}`}
            underline="hover"
            color="primary"
          >
            {cat.nom}
          </Link>
        </ListItemText>
      </ListItem>
      {cat.children.length > 0 && (
        <List component="div" disablePadding>
          {renderTree(cat.children, level + 1)}
        </List>
      )}
    </React.Fragment>
  ));

const CategoryList: React.FC = () => {
  const { data: categories = [], isLoading: loading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => nodeApi.getAllCategories()
  });

  const categoryTree = buildCategoryTree(categories);

  return (
    <>
      <TopBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack spacing={4}>
          <Typography variant="h4" component="h1" textAlign="center">
            Liste des Catégories
          </Typography>
          {loading && (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {error && <Alert severity="error">{(error as any).message}</Alert>}
          {!loading && !error && (
            <>
              {categories.length === 0 ? (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  textAlign="center"
                >
                  Aucune catégorie trouvée.
                </Typography>
              ) : (
                <List>{renderTree(categoryTree)}</List>
              )}
            </>
          )}
        </Stack>
        <ReportIssueButton />
      </Container>
    </>
  );
};

export default CategoryList;

