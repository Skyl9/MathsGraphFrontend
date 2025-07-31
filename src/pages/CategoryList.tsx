import React, { useEffect, useState } from "react";
import { Container, Typography, Stack, CircularProgress, Box, Alert, List, ListItem, ListItemText, Link } from "@mui/material";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";
import {Category} from "../types/types";
import {ReportIssueButton} from "../components/Issue";



const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Appel API pour récupérer les catégories
    const fetchCategories = async () => {
      try {
        const data = await nodeApi.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(nodeApi.handleError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  useEffect(()=>
      {
        console.log(categories)
      }
  )

  return (
    <>
      {/* Barre supérieure */}
      <TopBar />

      {/* Conteneur principal */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Stack spacing={4}>
          {/* Titre principal */}
          <Typography variant="h4" component="h1" textAlign="center">
            Liste des Catégories
          </Typography>

          {/* Indicateur de chargement */}
          {loading && (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}

          {/* Affichage des erreurs */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Liste des catégories */}
          {!loading && !error && (
            <>
              {categories.length === 0 ? (
                <Typography variant="body1" color="textSecondary" textAlign="center">
                  Aucune catégorie trouvée.
                </Typography>
              ) : (
                <List>
                  {categories.map((category) => (
                    <ListItem key={category.id}>
                      <ListItemText>
                        <Link href={`/category/${category.id}`} underline="hover" color="primary">
                          {category.nom}
                        </Link>
                      </ListItemText>
                    </ListItem>
                  ))}
                </List>
              )}
            </>
          )}
        </Stack>
        <ReportIssueButton></ReportIssueButton>
      </Container>
    </>
  );
};

export default CategoryList;