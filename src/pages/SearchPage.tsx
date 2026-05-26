import { useState, ChangeEvent, FormEvent, Fragment } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Box, Grid, Typography, Paper, Checkbox, FormGroup,
    FormControlLabel, Divider, List, ListItem, ListItemText,
    Chip, CircularProgress, TextField, Button
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from '../services/api';

interface SearchResult {
    id: number | string;
    nom: string;
    entity_type: string;
    extrait?: string;
}

export const SearchPage = () => {
    // 1. Récupération du terme tapé dans la barre de recherche globale (?q=...)
    const [searchParams, setSearchParams] = useSearchParams();
    const queryTerm = searchParams.get('q') || '';
    const [localQuery, setLocalQuery] = useState(queryTerm);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        setSearchParams({ q: localQuery }); // Met à jour l'URL, ce qui déclenche React Query
    };
    // 2. État de nos filtres (Tier gauche)
    const [filters, setFilters] = useState({
        concept: true,
        mathematicien: true,
        category: true,
        verifiedOnly: false // Exemple de filtre spécifique
    });

    // Gestion du clic sur un filtre
    const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.checked,
        });
    };

    // 3. Appel API avec React Query (Le moteur sous le capot)
    const { data: results, isLoading, error } = useQuery<SearchResult[]>({
        queryKey: ['advancedSearch', queryTerm, filters], // Refetch automatique si le terme ou les filtres changent !
        queryFn: async () => {
            if (!queryTerm) return [];
            return await nodeApi.advanceSearch(queryTerm, filters);
            },
        enabled: queryTerm.length > 0 // Ne cherche que s'il y a un mot
    });

    return (
        <>
        <Box sx={{ p: 4, maxWidth: 1200, margin: '0 auto', minHeight: '80vh' }}>
            <Typography variant="h4" gutterBottom>
                Résultats pour "{queryTerm}"
            </Typography>

            <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="Modifier ma recherche..."
                />
                <Button type="submit" variant="contained" color="primary">Rechercher</Button>
            </Box>
            <Grid container spacing={4} sx={{ mt: 2 }}>

                {/* ==========================================
                    TIER GAUCHE : LES FILTRES (1/3 = xs:12 md:4)
                ========================================== */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
                        <Typography variant="h6" gutterBottom>
                            Filtres
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Type de contenu
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={filters.concept} onChange={handleFilterChange} name="concept" />}
                                label="Théorèmes & Concepts"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.mathematicien} onChange={handleFilterChange} name="mathematicien" />}
                                label="Mathématiciens"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={filters.category} onChange={handleFilterChange} name="category" />}
                                label="Catégories"
                            />
                        </FormGroup>

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                            Qualité
                        </Typography>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={filters.verifiedOnly} onChange={handleFilterChange} name="verifiedOnly" />}
                                label="Concepts vérifiés uniquement"
                            />
                        </FormGroup>
                    </Paper>
                </Grid>


                {/* ==========================================
                    LES 2 TIERS RESTANTS : RÉSULTATS (2/3 = xs:12 md:8)
                ========================================== */}

                <Grid size={{ xs: 12, md: 8 }}>
                    {isLoading && <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>}
                    {error && <Typography color="error">Une erreur est survenue pendant la recherche.</Typography>}

                    {!isLoading && !error && results?.length === 0 && queryTerm && (
                        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Aucun résultat trouvé pour cette recherche.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Essayez de modifier vos filtres ou de chercher un autre terme.
                            </Typography>
                        </Paper>
                    )}

                    {/* Affichage des résultats */}
                    {!isLoading && results && results.length > 0 && (
                        <Paper elevation={2}>
                            <List>
                                {results.map((item, index) => (
                                    <Fragment key={item.id}>
                                        <ListItem alignItems="flex-start" sx={{ p: 3 }}>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                                        {/* Adapte le lien selon l'entité */}
                                                        <Link to={`/${item.entity_type}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                            <Typography variant="h6" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                                                {item.nom}
                                                            </Typography>
                                                        </Link>
                                                        <Chip size="small" label={item.entity_type} variant="outlined" />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {/* L'extrait du concept ou la bio du mathématicien */}
                                                        {item.extrait || "Aucune description disponible..."}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        {index < results.length - 1 && <Divider />}
                                    </Fragment>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
        </>
    );
};