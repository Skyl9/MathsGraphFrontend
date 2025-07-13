export interface NodeData {
    id: number;
    nom: string;
    position: {
        [grille: string]: { x: number; y: number; z: number };
    };
    typeMath: string;
}
export interface MathematicienName{
    id:number;
    nom:string;
}
export interface Mathematicien{
    id:number;
    nom:string;
    date_naissance:string;
    date_deces:string;
    biographie:string;
    nationalite:string;
    domaine:string;
    url:string;
    recompenses:string;
    epoque:string;
}

export interface EdgeData {
    start: number;
    end: number;
    type?: string;
}

export interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}

// AllNodeData.ts
export interface Alias {
    alias: string;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    field: keyof AllNodeData | keyof Mathematicien | keyof Category | keyof Type;
    value: any;
    onChange: (value: any) => void;
    fieldConfig: EditableField;
    data?: AllNodeData |Mathematicien | Type | Category | null;
    setData: (data: AllNodeData |Mathematicien) => void;
    createField: any;
    refetchData:any;
}


export interface Source {
    id: number;
    titre: string;
    auteur: string;
    annee: number;
    url: string;
    type: string;
}

export interface NomEtranger {
    Nom_étranger: string;
    langue: string;
}

export type RelationType = 'utilise' | 'implication' | 'equivalence' | 'reciproque';


export interface Relations {
    id: number;
    concept_source: { "id": number, nom: string };
    concept_cible: { "id": number, nom: string };
    type_relation: RelationType;
    description: string;
}

export type EditableField = {
    label: string;
    type: 'text' | 'select' | "checkbox" | "none" | "relation" | "alias" | "sources" | "nom_etranger" | "latex"|"tag";
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
export interface Type {
    id:number;
    type:string;
}
export interface ConceptName{
    id:number;
    nom:string;
}

export interface TypeName {
    id:number;
    type:string;
}
export interface Category {
    id:number;
    nom:string;
    description:string;
}