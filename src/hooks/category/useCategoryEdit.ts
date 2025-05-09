import {useCategoryData} from "./useCategoryData";
import {useState} from "react";
import {Category, Mathematicien} from "../../types/types";
import {createCategoryEditableFields,} from "../../constants/editableFields";

export const useCategoryEdit = (id:string) => {
    const { data,setData, loading, error, editableFieldsOptions,refetchData,updateField,createField } = useCategoryData(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof Category | null>(null);
    const [newContent, setNewContent] = useState<string | undefined>(undefined);


    const editableFields = createCategoryEditableFields(editableFieldsOptions)

    const handleEdit = (field: keyof Category) => {
        setCurrentEditField(field);
        setNewContent(String(data?.[field] || ""));
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

    const saveChanges=async()=>{
        console.log("saveChanges")
        if(!currentEditField) return;
        try{
            await updateField(currentEditField, newContent);
        }
        catch(err){
            console.error("Erreur lors de la sauvegarde:", err);
        }
        cancelChanges();
        await refetchData();

    }

    return {
        data,
        loading,
        error,
        isModalOpen,
        currentEditField,
        newContent,
        handleEdit,
        setNewContent,
        handleChange,
        cancelChanges,
        refetchData,
        setData,
        editableFields,
        updateField,
        createField,
        saveChanges
    }
}