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
};

export const useEntityEdit = <T,>(entityType: EntityType, id: string) => {
    const {
        data, setData, loading, error, editableFieldsOptions,
        refetchData, updateField, createField
    } = useEntityData<T>(entityType, id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof T | null>(null);

    const [newContent, setNewContent] = useState<any>(undefined);

    const [isSaving, setIsSaving] = useState(false);

    const editableFields = useMemo(() => {
        const generateFields = FIELDS_GENERATOR_MAP[entityType];
        return generateFields(editableFieldsOptions) as any;
    }, [entityType, editableFieldsOptions]);

    const handleEdit = (field: keyof T) => {
        setCurrentEditField(field);

        const currentValue = (data as any)?.[field];
        setNewContent(currentValue !== null && currentValue !== undefined ? currentValue : "");

        setIsModalOpen(true);
    };

    const handleChange = (value: any) => {
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