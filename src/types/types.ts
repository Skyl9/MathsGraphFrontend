import {Relations} from "./ApiTypes/Relations";
import {Source} from "./ApiTypes/source";



// ModalProps.ts

export interface ModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    field: keyof T;
    value: unknown;
    onChange: (value: unknown) => void;
    fieldConfig: EditableField;
    data: T | null;
    setData: (data: T) => void;
    createField: (field: string, value: unknown) => Promise<boolean | void>;
    refetchData: () => Promise<any>;
    isSaving: boolean;
}

export interface NomEtranger {
    Nom_étranger: string;
    langue: string;
}

export type EditableField = {
    label: string;
    type: 'text' | 'select' | "checkbox" | "none" | "relation" | "alias" | "sources" | "nom_etranger" | "latex"|"tag"|"category";
    options?: string[];
};

export interface AllNodeData {
    id: number;
    nom: string;
    type: string;
    enonce: string;
    categorie: {
        id: number;
        category: string;
    };
    aliases: string[];
    mathematicien: {
        id: number;
        mathematicien: string;
    };
    date_ajout?: string;
    date_modification?: string;
    demonstration: string;
    relations: Relations[];
    sources: Source[];
    verification: boolean;
    noms_etrangers?: NomEtranger[];
    tags?: Tag[];
}
export interface Tag{
    id:number;
    tag:string;
}

export interface RollbackConcept{
    version_number:number;
    field_modified:string;
    username:string;


}