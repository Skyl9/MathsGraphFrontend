import {useState} from 'react';
import { AllNodeData } from '../../types/types';
import { useNodeData } from './useNodeData';
import { createEditableFields } from '../../constants/editableFields';

export const useNodeEdit = (id: string) => {
  const { data,setData, loading, error, editableFieldsOptions, updateField, refetchData,createField } = useNodeData(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditField, setCurrentEditField] = useState<keyof AllNodeData | null>(null);
  const [newContent, setNewContent] = useState<string | undefined>(undefined);

  const editableFields = createEditableFields(editableFieldsOptions);
  const handleEdit = (field: keyof AllNodeData) => {
    setCurrentEditField(field);
    setNewContent(String(data?.[field] || ""));
    setIsModalOpen(true);
  };

  const handleChange = (value: any) => {
    setNewContent(typeof value === "string" ? value : undefined);
  };

  const saveChanges = async () => {
    if (!currentEditField) return;


    try {
      if (currentEditField === "relations" || currentEditField === "aliases" || 
          currentEditField === "sources" || currentEditField === "noms_etrangers") {
        // Ces champs sont gérés directement par les composants d'édition
        if (data) {
          await updateField(currentEditField, data[currentEditField]);
        }
      } else if(currentEditField === "verification"){
        if(newContent!==undefined){
          await updateField(currentEditField, newContent);
        }

      }else if (newContent !== undefined) {
        await updateField(currentEditField, newContent);
      }
      
      cancelChanges();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    }
  };

  const cancelChanges = () => {
    setIsModalOpen(false);
    setCurrentEditField(null);
    setNewContent(undefined);
  };

  return {
    data,
    loading,
    error,
    editableFields,
    isModalOpen,
    currentEditField,
    newContent,
    handleEdit,
    setNewContent,
    handleChange,
    saveChanges,
    cancelChanges,
    refetchData,
    setData,
    createField,

  };
};