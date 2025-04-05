import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch(query);
        }
    };

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <TextField
                label="Rechercher un nœud"
                variant="outlined"
                size="small"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <Button variant="contained" onClick={handleSearch}>
                Rechercher
            </Button>
        </Box>
    );
};

export default SearchBar;