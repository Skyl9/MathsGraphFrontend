import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress, InputAdornment, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { nodeApi } from '../services/api';

interface SearchResult {
    id: number;
    nom: string;
    entity_type: 'concept' | 'mathematicien' | 'category';
}

export const GlobalSearchBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<SearchResult[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // L'effet qui déclenche la recherche quand on tape
    useEffect(() => {
        let active = true;

        if (inputValue.length < 2) {
            setOptions([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                // Remplace par ton véritable appel API
                const results = await nodeApi.quickSearch(inputValue);
                if (active) {
                    setOptions(results as any);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (active) setLoading(false);
            }
        };

        // Petit délai (debounce) pour ne pas spammer l'API à chaque lettre tapée
        const timeoutId = setTimeout(() => fetchResults(), 300);
        return () => {
            active = false;
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    // Gère la sélection d'un item dans le menu déroulant
    const handleSelect = (event: any, newValue: SearchResult | string | null) => {
        if (typeof newValue === 'object' && newValue !== null) {
            // L'utilisateur a cliqué sur un aperçu !
            if (newValue.entity_type === 'concept') navigate(`/concept/${newValue.id}`);
            if (newValue.entity_type === 'mathematicien') navigate(`/mathematiciens`); // Adapte selon tes routes
            if (newValue.entity_type === 'category') navigate(`/categories`);
            setOpen(false);
        }
    };

    // Gère l'appui sur "Entrée"
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            event.preventDefault(); // Empêche le comportement par défaut
            setOpen(false); // Ferme le menu
            navigate(`/search?q=${encodeURIComponent(inputValue)}`); // Redirige vers ta future page !
        }
    };

    return (
        <Autocomplete
            sx={{ width: 300, bgcolor: 'background.paper', borderRadius: 1 }}
            size="small"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id && option.entity_type === value.entity_type}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.nom}
            options={options}
            loading={loading}
            freeSolo // 🌟 Permet de taper ce qu'on veut et de faire "Entrée" sans choisir dans la liste
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            onChange={handleSelect}
            renderOption={(props, option) => (
                <li {...props} key={`${option.entity_type}-${option.id}`}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                        <Typography variant="body2">{option.nom}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                            {option.entity_type}
                        </Typography>
                    </Box>
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder="Rechercher..."
                    onKeyDown={handleKeyDown} // 🌟 Capture la touche Entrée
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1 }}>
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};