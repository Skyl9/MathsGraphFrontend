import { useState, useEffect } from "react";
import { nodeApi } from "../services/api";
import { ModalProps, NomEtranger } from "../types/types";
import { Relations } from "../types/ApiTypes/Relations";
import { Source } from "../types/ApiTypes/source";
import { Category } from "../types/ApiTypes/category";
import { validateField } from "../validations/schemas.ts";
import {
  isAllNodeData,
  isMathematicien,
  isCategory,
} from "../utils/typeGuards";

export const useEditModalLogic = <T extends object>({
  data,
  field,
  value,
  onChange,
  onSave,
}: Pick<ModalProps<T>, "data" | "field" | "value" | "onChange" | "onSave">) => {
  const [valError, setValError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Charger les catégories existantes pour le sélecteur parent_id
  useEffect(() => {
    if (field === "parent_id" && isCategory(data)) {
      nodeApi
        .getAllCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [field, data]);

  // Pour les relations
  const handleRelationChange = (index: number, updatedRelation: Relations) => {
    const currentList = Array.isArray(value)
      ? value
      : data && isAllNodeData(data)
        ? data.relations
        : [];
    const updated = [...currentList];
    updated[index] = updatedRelation;
    onChange(updated);
  };

  // Pour les sources
  const handleSourceChange = (index: number, updatedSource: Source) => {
    const currentList = Array.isArray(value)
      ? value
      : data && isAllNodeData(data)
        ? data.sources
        : [];
    const updated = [...currentList];
    updated[index] = updatedSource;
    onChange(updated);
  };

  // Pour les alias
  const handleAliasChange = (index: number, updatedValue: string) => {
    const currentList = Array.isArray(value)
      ? value
      : data && isAllNodeData(data)
        ? data.aliases
        : [];
    const updated = [...currentList];
    updated[index] = updatedValue;
    onChange(updated);
  };

  // Pour les noms étrangers
  const handleNomEtrangerChange = (index: number, updatedNom: NomEtranger) => {
    const currentList = Array.isArray(value)
      ? value
      : data && isAllNodeData(data) && data.noms_etrangers
        ? data.noms_etrangers
        : [];
    const updated = [...currentList];
    updated[index] = updatedNom;
    onChange(updated);
  };

  const handleSaveClick = () => {
    // 1. Identifier sur quelle entité on se trouve
    let entityType: "concept" | "mathematicien" | "category" | "type" | null =
      null;
    if (isAllNodeData(data)) entityType = "concept";
    else if (isMathematicien(data)) entityType = "mathematicien";
    else if (isCategory(data)) entityType = "category";
    else if (data && typeof data === "object" && "type" in data)
      entityType = "type";

    // 2. Si on a trouvé une entité et qu'on modifie du texte, on valide avec Zod
    if (entityType && typeof value === "string") {
      const valRes = validateField(entityType, field as string, value);
      if (!valRes.success) {
        setValError(valRes.error as string | null);
        return;
      }
    }

    // Tout est valide ! On efface l'erreur visuelle et on lance la sauvegarde
    setValError(null);
    onSave();
  };

  return {
    valError,
    categories,
    handleRelationChange,
    handleSourceChange,
    handleAliasChange,
    handleNomEtrangerChange,
    handleSaveClick,
  };
};
