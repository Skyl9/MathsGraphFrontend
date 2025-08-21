import {useTypeData} from "./useTypeData";
import {useState} from "react";
import {createTypeEditableFields} from "../../constants/editableFields";
import {Type} from "../../types/ApiTypes/type";

export const useTypeEdit = (id:string) => {
    const { data,setData, loading, error, editableFieldsOptions,refetchData,updateField,createField } = useTypeData(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof Type | null>(null);
    const [newContent, setNewContent] = useState<string | undefined>(undefined);


    const editableFields = createTypeEditableFields(editableFieldsOptions)

    const handleEdit = (field: keyof Type) => {
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