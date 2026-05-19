import {Box, Button, TextField, Select, MenuItem, Autocomplete, Typography} from "@mui/material";
import React, { useEffect, useState } from "react";
import { nodeApi } from '../../services/api';


type FieldAddRelationProps = {
    nodeName: string;
    createField: (type: string, data: any) => void;
};
interface LabelValue {
    label: string;
    value: any; // Or a more specific type if known
}

const FieldAddRelation: React.FC<FieldAddRelationProps> = ({nodeName, createField }) => {
    const [theorems, setTheorems] = useState<LabelValue[]>([]);
    const [theo2, setTheo2] = useState<{ label: string } | null>(null);
    const [relation, setRelation] = useState("");
    const [description, setDescription] = useState("");
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchTheorems = async () => {
            const names = await nodeApi.getAllConceptNames();
            console.log(names)
            const list = names.map((name: any) => ({ label: name["nom"],value: name["id"] }));
            setTheorems(list);
        };

        fetchTheorems();
    }, []);

    const handleAdd = async () => {
        console.log(nodeName)
        if (!theo2 || !relation) return;
        createField("relations", {
            "théo1": nodeName,
            "théo2": theo2.label,
            "relation": relation,
            "desc": description,
        });
        // Reset
        setTheo2(null);
        setRelation("");
        setDescription("");
        setAdding(false);
    };

    return (
        <Box mt={2}>
            {!adding ? (
                <Button sx={{ mt: 1 }} onClick={() => setAdding(true)}>
                    Ajouter une Relation
                </Button>
            ) : (
                <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mt={1}>
                    <Typography>
                        {nodeName}
                    </Typography>


                    <Select
                        size="small"
                        value={relation}
                        onChange={(e) => setRelation(e.target.value)}
                        displayEmpty
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="" disabled>Relation</MenuItem>
                        <MenuItem value="reciproque">impliqué par</MenuItem>
                        <MenuItem value="implique">implique</MenuItem>
                        <MenuItem value="equivalencce">équivalent à</MenuItem>
                        <MenuItem value="utilise">utilise</MenuItem>
                    </Select>


                    <Autocomplete
                        size="small"
                        options={theorems}
                        value={theo2}
                        onChange={(_e, newValue) => setTheo2(newValue ?? null)}
                        renderInput={(params) => <TextField {...params} label="Théorème 2" />}
                        sx={{ minWidth: 200 }}
                    />

                    <TextField
                        size="small"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ minWidth: 200 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAdd}
                        disabled={!theo2 || !relation}
                    >
                        Valider
                    </Button>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setAdding(false)}
                    >
                        Annuler
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default FieldAddRelation;
