// src/hooks/useEntityEdit.ts
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useEntityData, EntityType } from "./useEntityData";
import { EditableField } from "../types/types";
import {
  createCategoryEditableFields,
  createTypeEditableFields,
  createMathematicienEditableFields,
  createEditableFields,
} from "../constants/editableFields";

// Mapping pour récupérer les configurations de modales
const FIELDS_GENERATOR_MAP = {
  category: createCategoryEditableFields,
  type: createTypeEditableFields,
  mathematicien: createMathematicienEditableFields,
  concept: createEditableFields,
} as const;

export const useEntityEdit = <T extends object>(
  entityType: EntityType,
  id: string,
) => {
  const {
    data,
    loading,
    error,
    editableFieldsOptions,
    refetchData,
    updateField,
    createField,
  } = useEntityData<T>(entityType, id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<keyof T | null>(
    null,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newContent, setNewContent] = useState<any>(undefined);

  const [isSaving] = useState(false);

  const editableFields = useMemo(() => {
    const generateFields =
      FIELDS_GENERATOR_MAP[entityType as keyof typeof FIELDS_GENERATOR_MAP];
    return generateFields(editableFieldsOptions as never) as Record<
      keyof T,
      EditableField
    >;
  }, [entityType, editableFieldsOptions]);

  const handleEdit = (field: keyof T) => {
    setCurrentEditField(field);

    const currentValue = data
      ? (data as Record<keyof T, unknown>)[field]
      : undefined;
    setNewContent(
      currentValue !== null && currentValue !== undefined ? currentValue : "",
    );

    setIsModalOpen(true);
  };

  const handleChange = (value: unknown) => {
    setNewContent(value);
  };

  const cancelChanges = () => {
    setIsModalOpen(false);
    setCurrentEditField(null);
    setNewContent(undefined);
  };

  const saveChanges = async () => {
    if (!currentEditField) return;

    const field = currentEditField;
    const value = newContent;

    // Optimistic UI : On ferme la modale instantanément
    cancelChanges();

    try {
      const success = await updateField(field, value);
      if (success) {
        toast.success("Modifications sauvegardées avec succès");
      }
      // Les erreurs (success === false) sont déjà affichées via un toast global dans api.ts
    } catch (err) {
      console.error("Erreur critique lors de la sauvegarde:", err);
    }
  };

  return {
    data,
    loading,
    error,
    isModalOpen,
    currentEditField,
    newContent,
    isSaving,
    handleEdit,
    setNewContent: handleChange,
    cancelChanges,
    refetchData,
    editableFields,
    updateField,
    createField,
    saveChanges,
  };
};
