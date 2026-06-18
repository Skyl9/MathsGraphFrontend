import { Box, Button, MenuItem, Select, TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

type FieldWithAddProps = {
  createField: (field: string, value: unknown) => Promise<boolean | void>;
  id: number;
};

const FieldAddSource: React.FC<FieldWithAddProps> = ({ createField, id }) => {
  const { t } = useTranslation();
  const [adding, setAdding] = React.useState(false);
  const [newSource, setnewSource] = React.useState("");
  const [newAuteur, setnewAuteur] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState<number>(2025);
  const [typeSource, settypeSource] = React.useState("");
  const [url, setUrl] = React.useState("");

  const isValidUrl = (value: string) => {
    try {
      new URL(value); // Essaie de créer un objet URL
      return true;
    } catch {
      return false;
    }
  };

  const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    if (!isValidUrl(input)) {
      console.error("URL non valide !");
    }
    setUrl(input);
  };

  const handleAdd = async () => {
    if (!newSource.trim() || !newAuteur.trim() || !typeSource.trim()) return;
    createField("sources", {
      source: newSource,
      auteur: newAuteur,
      annee: selectedDate,
      type: typeSource,
      id: id,
      url: url,
    });
    setUrl("");
    setAdding(false);
    setnewSource("");
    setnewAuteur("");
    setSelectedDate(2025);
    settypeSource("");
  };
  return (
    <Box mt={2}>
      {!adding ? (
        <Button sx={{ mt: 1 }} onClick={() => setAdding(true)}>
          {t("source.add_button")}
        </Button>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center" mt={1}>
          <TextField
            label={t("source.fields.title")}
            value={newSource}
            onChange={(e) => setnewSource(e.target.value)}
          ></TextField>

          <TextField
            label="Auteur"
            value={newAuteur}
            onChange={(e) => setnewAuteur(e.target.value)}
          ></TextField>
          <TextField
            className="source-input"
            type="number"
            placeholder="Année"
            value={selectedDate}
            onChange={(e) => setSelectedDate(parseInt(e.target.value))}
          />

          <Select
            label="type "
            value={typeSource} // Associe la valeur actuelle de typeSource
            onChange={(e) => settypeSource(e.target.value)} // Met à jour typeSource
            displayEmpty // Affiche un placeholder lorsqu'aucune option n'est sélectionnée
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="" disabled>
              Sélectionner un type
            </MenuItem>
            <MenuItem key={0} value={"livre"}>
              Livre
            </MenuItem>
            <MenuItem key={1} value={"article"}>
              Article
            </MenuItem>
            <MenuItem key={2} value={"site_web"}>
              Site Web
            </MenuItem>
            <MenuItem key={3} value={"autre"}>
              Autre
            </MenuItem>
          </Select>

          <TextField
            label="Entrer une URL"
            type="url" // Spécifie un champ de type URL
            value={url} // Associe l'état à ce champ
            onChange={handleChangeUrl} // Gestion des modifications
            fullWidth
            helperText="Saisissez une URL valide, ex: https://example.com" // Message d'aide (optionnel)
            variant="outlined"
          />

          <Button variant="contained" color="primary" onClick={handleAdd}>
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

export default FieldAddSource;
