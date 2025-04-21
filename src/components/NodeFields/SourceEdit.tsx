import React from 'react';
import { Source } from '../../types/types';
import {FormControl, MenuItem, OutlinedInput, Select, TextField} from "@mui/material";

interface SourceEditProps {
  source: Source;
  onChange: (updatedSource: Source) => void;
}

const SourceEdit: React.FC<SourceEditProps> = ({ source, onChange }) => {
  return (
        <form noValidate autoComplete="off">
            <FormControl sx={{ width: '25ch' }}>
                <TextField className="source-input"
                           type="text"
                           placeholder="Titre"
                           value={source.titre || ""}
                           onChange={(e) => onChange({ ...source, titre: e.target.value })}></TextField>

                <TextField className="source-input"
                           type="text"
                           placeholder="Auteur"
                           value={source.auteur || ""}
                           onChange={(e) => onChange({ ...source, auteur: e.target.value })}
                />

                <TextField className="source-input"
                           type="number"
                           placeholder="Année"
                           value={source.annee || ""}
                           onChange={(e) => onChange({ ...source, annee: parseInt(e.target.value) })}
                />
                <Select
                    className="source-select"
                    value={source.type}
                    onChange={(e) => onChange({ ...source, type: e.target.value })}
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