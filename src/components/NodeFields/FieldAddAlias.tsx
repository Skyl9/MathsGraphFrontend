import { Box, Button, TextField } from "@mui/material";
import React from "react";

type FieldWithAddProps = {
    onChange: any;
    createField: any;
    id:number;
    // onAdd: (newItem: string) => Promise<void>; // ou gérer l’API ici directement
};

const FieldAddAlias: React.FC<FieldWithAddProps> = ({ onChange,createField,id }) => {
    const [adding, setAdding] = React.useState(false);
    const [newItem, setNewItem] = React.useState("");

    const handleAdd = async () => {
        if (!newItem.trim()) return;
        onChange(newItem.trim());
        createField("aliases", {"id":id,"value":newItem});
        setNewItem("");
        setAdding(false);
    };
    // <Button onClick={() => { setNewItem(""); setAdding(false); }}>Annuler</Button>
    return (
        <Box mt={2}>
            {!adding ? (
                <Button sx={{ mt: 1 }} onClick={() => setAdding(true)}>Ajouter un Alias</Button>
            ) : (
                <Box display="flex" gap={1} mt={1}>
                    <TextField size="small" value={newItem} onChange={(e) => setNewItem(e.target.value)} label={`Nouvel Alias`} />
                    <Button variant="outlined" onClick={handleAdd}>Valider</Button>

                </Box>
            )}
        </Box>
    );
};

export default FieldAddAlias;