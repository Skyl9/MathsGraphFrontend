import { Box, Button, TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

type FieldWithAddProps = {
  onChange: (value: unknown) => void;
  createField: (field: string, value: unknown) => Promise<boolean | void>;
  label: string;
  // onAdd: (newItem: string) => Promise<void>; // ou gérer l’API ici directement
};

const FieldAdd: React.FC<FieldWithAddProps> = ({
  label,
  onChange,
  createField,
}) => {
  const { t } = useTranslation();
  const [adding, setAdding] = React.useState(false);
  const [newItem, setNewItem] = React.useState("");

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    onChange(newItem.trim());
    createField(label, newItem);
    setNewItem("");
    setAdding(false);
  };
  // <Button onClick={() => { setNewItem(""); setAdding(false); }}>Annuler</Button>
  return (
    <Box mt={2}>
      {!adding ? (
        <Button sx={{ mt: 1 }} onClick={() => setAdding(true)}>
          Ajouter un {label.toLowerCase()}
        </Button>
      ) : (
        <Box display="flex" gap={1} mt={1}>
          <TextField
            size="small"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            label={`Nouveau ${label.toLowerCase()}`}
          />
          <Button variant="outlined" onClick={handleAdd}>
            {t("common.validate")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FieldAdd;
