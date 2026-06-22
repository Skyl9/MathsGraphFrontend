// components/Relations/RelationEdit.tsx
import FormControl from "@mui/material/FormControl";
import React from "react";
import { MenuItem, Select, TextField } from "@mui/material";
import { Relations } from "../../types/ApiTypes/Relations";
import { useTranslation } from "react-i18next";

interface RelationEditProps {
  relation: Relations;
  onChange: (updatedRelation: Relations) => void;
}

export const RelationEdit: React.FC<RelationEditProps> = ({
  relation,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="relation-edit-line"
      style={{ display: "flex", alignItems: "center", gap: "1rem" }}
    >
      <span className="relation-concept">{relation.concept_source.nom}</span>

      <FormControl sx={{ minWidth: 150 }}>
        <Select
          className="relation-select"
          value={relation.type_relation}
          onChange={(e) =>
            onChange({
              ...relation,
              type_relation: e.target.value as Relations["type_relation"],
            })
          }
        >
          <MenuItem value="utilise">utilise</MenuItem>
          <MenuItem value="implication">implication</MenuItem>
          <MenuItem value="equivalence">équivalence</MenuItem>
          <MenuItem value="reciproque">Réciproque</MenuItem>
        </Select>
      </FormControl>

      <span className="relation-concept">{relation.concept_cible.nom}</span>

      <TextField
        className="relation-description"
        type="text"
        placeholder={t("relation.fields.description")}
        value={relation.description ?? ""}
        label={t("relation.fields.description")}
        margin="dense"
        variant="standard"
        onChange={(e) =>
          onChange({
            ...relation,
            description: e.target.value,
          })
        }
        sx={{ minWidth: 200 }}
      />
    </div>
  );
};
