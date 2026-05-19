// src/hooks/useEntityEdit.ts
import { useState, useMemo } from "react";
import { useEntityData, EntityType } from "./useEntityData";
import {
    createCategoryEditableFields,
    createTypeEditableFields,
    createMathematicienEditableFields
} from "../constants/editableFields";

// Mapping pour récupérer les configurations de modales
const FIELDS_GENERATOR_MAP = {
    category: createCategoryEditableFields,
    type: createTypeEditableFields,
    mathematicien: createMathematicienEditableFields
} as const;

export const useEntityEdit = <T extends object>(entityType: EntityType, id: string) => {
    const {
        data, setData, loading, error, editableFieldsOptions,
        refetchData, updateField, createField
    } = useEntityData<T>(entityType, id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof T | null>(null);

    const [newContent, setNewContent] = useState<unknown>(undefined);

    const [isSaving, setIsSaving] = useState(false);

    const editableFields = useMemo(() => {
        const generateFields = FIELDS_GENERATOR_MAP[entityType] as any;
        return generateFields(editableFieldsOptions);
    }, [entityType, editableFieldsOptions]);

    const handleEdit = (field: keyof T) => {
        setCurrentEditField(field);

        const currentValue = data ? (data as Record<keyof T, unknown>)[field] : undefined;
        setNewContent(currentValue !== null && currentValue !== undefined ? currentValue : "");

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

        setIsSaving(true); // On désactive le bouton
        try {
            await updateField(currentEditField, newContent);

            cancelChanges();
            await refetchData();

        } catch (err) {
            console.error("Erreur lors de la sauvegarde:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        data, loading, error, isModalOpen, currentEditField, newContent,
        isSaving,
        handleEdit, setNewContent: handleChange, cancelChanges, refetchData,
        setData, editableFields, updateField, createField, saveChanges
    };
};