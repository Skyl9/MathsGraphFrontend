import { useState, useEffect } from "react";
import { nodeApi } from "../services/api";
import { AllNodeData, ModalProps, NomEtranger } from "../types/types";
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
  setData,
  field,
  value,
  onSave,
}: Pick<ModalProps<T>, "data" | "setData" | "field" | "value" | "onSave">) => {
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
    if (data && isAllNodeData(data)) {
      const updated = [...data.relations];
      updated[index] = updatedRelation;
      (setData as unknown as (data: AllNodeData) => void)({
        ...data,
        relations: updated,
      });
    }
  };

  // Pour les sources
  const handleSourceChange = (index: number, updatedSource: Source) => {
    if (data && isAllNodeData(data)) {
      const updated = [...data.sources];
      updated[index] = updatedSource;
      (setData as unknown as (data: AllNodeData) => void)({
        ...data,
        sources: updated,
      });
    }
  };

  // Pour les alias
  const handleAliasChange = (index: number, updatedValue: string) => {
    if (data && isAllNodeData(data)) {
      const updated = [...data.aliases];
      updated[index] = updatedValue;
      (setData as unknown as (data: AllNodeData) => void)({
        ...data,
        aliases: updated,
      });
    }
  };

  // Pour les noms étrangers
  const handleNomEtrangerChange = (index: number, updatedNom: NomEtranger) => {
    if (data && isAllNodeData(data)) {
      if (data.noms_etrangers) {
        const updated = [...data.noms_etrangers];
        updated[index] = updatedNom;
        (setData as unknown as (data: AllNodeData) => void)({
          ...data,
          noms_etrangers: updated,
        });
      }
    }
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
