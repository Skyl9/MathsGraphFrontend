import { useState } from "react";
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
    const [newContent, setNewContent] = useState<string | undefined>(undefined);

    // Génération dynamique des champs selon l'entité
    const generateFields = FIELDS_GENERATOR_MAP[entityType];
    const editableFields = generateFields(editableFieldsOptions) as any;

    const handleEdit = (field: keyof T) => {
        setCurrentEditField(field);
        setNewContent(String((data as any)?.[field] || ""));
        setIsModalOpen(true);
    };

    const handleChange = (value: any) => {
        setNewContent(typeof value === "string" ? value : undefined);
    };

    const cancelChanges = () => {
        setIsModalOpen(false);
        setCurrentEditField(null);
        setNewContent(undefined);
    };

    const saveChanges = async () => {
        if (!currentEditField) return;
        try {
            await updateField(currentEditField, newContent);
        } catch (err) {
            console.error("Erreur lors de la sauvegarde:", err);
        }
        cancelChanges();
        await refetchData();
    };

    return {
        data, loading, error, isModalOpen, currentEditField, newContent,
        handleEdit, setNewContent, handleChange, cancelChanges, refetchData,
        setData, editableFields, updateField, createField, saveChanges
    };
};