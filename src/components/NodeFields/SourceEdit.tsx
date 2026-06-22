import React from "react";
import { FormControl, MenuItem, Select, TextField } from "@mui/material";
import { Source } from "../../types/ApiTypes/source";
import { useTranslation } from "react-i18next";

interface SourceEditProps {
  source: Source;
  onChange: (updatedSource: Source) => void;
}

const SourceEdit: React.FC<SourceEditProps> = ({ source, onChange }) => {
  const { t } = useTranslation();
  return (
    <form noValidate autoComplete="off">
      <FormControl
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 3,
        }}
      >
        <TextField
          className="source-input"
          label={t("source.fields.title")}
          type="text"
          placeholder={t("source.fields.title")}
          value={source.titre || ""}
          onChange={(e) => onChange({ ...source, titre: e.target.value })}
          variant="outlined"
          fullWidth
        ></TextField>

        <TextField
          className="source-input"
          label={t("source.fields.author")}
          type="text"
          placeholder={t("source.fields.author")}
          value={source.auteur || ""}
          onChange={(e) => onChange({ ...source, auteur: e.target.value })}
        />

        <TextField
          className="source-input"
          label={t("source.fields.year")}
          type="number"
          placeholder={t("source.fields.year")}
          value={source.annee || ""}
          onChange={(e) =>
            onChange({ ...source, annee: parseInt(e.target.value) })
          }
        />
        <Select
          label={t("source.fields.type")}
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
