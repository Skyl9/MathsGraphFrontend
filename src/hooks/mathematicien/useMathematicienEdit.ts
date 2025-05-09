import {useMathematicienData} from "./useMathematicienData";
import {useState} from "react";
import {Mathematicien} from "../../types/types";
import {createMathematicienEditableFields} from "../../constants/editableFields";

export const useMathematicienEdit = (id:string) => {
    const { data,setData, loading, error, editableFieldsOptions,refetchData,updateField,createField } = useMathematicienData(id);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof Mathematicien | null>(null);
    const [newContent, setNewContent] = useState<string | undefined>(undefined);


    const editableFields = createMathematicienEditableFields(editableFieldsOptions)

    const handleEdit = (field: keyof Mathematicien) => {
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