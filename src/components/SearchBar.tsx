import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

interface SearchBarProps {
    onSearch: (query: string) => void;
    setIsSearch:  React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setIsSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (query===""){
                console.log(query)

                setIsSearch(false);
            }
            else {
                onSearch(query);
                setIsSearch(true);

            }
        }
        else{
            setIsSearch(false);
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