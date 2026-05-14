import {Mathematicien} from "./ApiTypes/mathematicien";
import {Category} from "./ApiTypes/category";
import {Type} from "./ApiTypes/type";
import {Relations} from "./ApiTypes/Relations";
import {Source} from "./ApiTypes/source";



// AllNodeData.ts

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    field: keyof AllNodeData | keyof Mathematicien | keyof Category | keyof Type;
    value: any;
    onChange: (value: any) => void;
    fieldConfig: EditableField;
    data?: AllNodeData |Mathematicien | Type | Category | null;
    setData: (data: AllNodeData |Mathematicien|Type|Category) => void;
    createField: any;
    refetchData:any;
    isSaving:boolean;
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
    date_ajout: string;
    demonstration: string;
    relations: Relations[];
    sources: Source[];
    verification: boolean;
    noms_etrangers?: NomEtranger[];
    tags?:Tag[];
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