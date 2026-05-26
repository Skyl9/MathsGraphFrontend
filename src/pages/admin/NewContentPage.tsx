import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from '../../services/api';

const NewContentPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        type: 'théorème',
        enonce: '',
        demonstration: '',
        categorie_id: '' as number | '',
        mathematicien_id: '' as number | ''
    });
    const [error, setError] = useState<string | null>(null);

    // Récupération des données pour les listes déroulantes
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: nodeApi.getAllCategories });
    const { data: types } = useQuery({ queryKey: ['types'], queryFn: nodeApi.getAllTypeNames });
    const { data: mathematiciens } = useQuery({ queryKey: ['mathematiciens'], queryFn: nodeApi.getAllMathematicienName });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categorie_id: formData.categorie_id === '' ? null : formData.categorie_id,
                mathematicien_id: formData.mathematicien_id === '' ? null : formData.mathematicien_id,
            };
            const result = await nodeApi.createConcept(payload);
            // Redirection vers la page du concept nouvellement créé
            navigate(`/concept/${result.id}`);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création");
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Créer un nouveau contenu</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Nom du concept" required fullWidth
                    value={formData.nom}
                    onChange={e => setFormData({...formData, nom: e.target.value})}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        select label="Type" required fullWidth
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                        {types?.map(t => <MenuItem key={t.id} value={t.type}>{t.type}</MenuItem>)}
                    </TextField>

                    <TextField
                        select label="Catégorie" fullWidth
                        value={formData.categorie_id}
                        onChange={e => setFormData({...formData, categorie_id: e.target.value as number})}
                    >
                        <MenuItem value=""><em>Aucune</em></MenuItem>
                        {categories?.map(c => <MenuItem key={c.id} value={c.id}>{c.nom}</MenuItem>)}
                    </TextField>

                    <TextField
                        select label="Mathématicien" fullWidth
                        value={formData.mathematicien_id}
                        onChange={e => setFormData({...formData, mathematicien_id: e.target.value as number})}
                    >
                        <MenuItem value=""><em>Aucun</em></MenuItem>
                        {mathematiciens?.map(m => <MenuItem key={m.id} value={m.id}>{m.nom}</MenuItem>)}
                    </TextField>
                </Box>

                <TextField
                    label="Énoncé (Markdown/LaTeX supporté)" required multiline rows={4} fullWidth
                    value={formData.enonce}
                    onChange={e => setFormData({...formData, enonce: e.target.value})}
                />

                <TextField
                    label="Démonstration (Optionnel)" multiline rows={6} fullWidth
                    value={formData.demonstration}
                    onChange={e => setFormData({...formData, demonstration: e.target.value})}
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/admin/contents')}>Annuler</Button>
                    <Button type="submit" variant="contained" color="primary">Créer le concept</Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default NewContentPage;