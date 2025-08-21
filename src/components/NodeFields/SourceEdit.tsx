import React from 'react';
import {FormControl, MenuItem, Select, TextField} from "@mui/material";
import {Source} from "../../types/ApiTypes/source";

interface SourceEditProps {
    source: Source;
    onChange: (updatedSource: Source) => void;
}

const SourceEdit: React.FC<SourceEditProps> = ({source, onChange}) => {
    return (
        <form noValidate autoComplete="off">
            <FormControl sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                gap: 3,


            }}>
                <TextField className="source-input"
                           label="Titre"
                           type="text"
                           placeholder="Titre"
                           value={source.titre || ""}
                           onChange={(e) => onChange({...source, titre: e.target.value})}
                           variant="outlined"
                           fullWidth
                ></TextField>

                <TextField className="source-input"
                           label="Auteur"
                           type="text"
                           placeholder="Auteur"
                           value={source.auteur || ""}
                           onChange={(e) => onChange({...source, auteur: e.target.value})}
                />

                <TextField className="source-input"
                           label="Année"
                           type="number"
                           placeholder="Année"
                           value={source.annee || ""}
                           onChange={(e) => onChange({...source, annee: parseInt(e.target.value)})}
                />
                <Select
                    label='Type de source'
                    className="source-select"
                    value={source.type}
                    onChange={(e) => onChange({...source, type: e.target.value})}
                >
                    <MenuItem value="livre">livre</MenuItem>
                    <MenuItem value="article">article</MenuItem>
                    <MenuItem value="site_web">site web</MenuItem>
                    <MenuItem value="autre">autre</MenuItem>
                </Select>


            </FormControl>
        </form>

    );
};

export default SourceEdit;