import {AllNodeData, EditableField} from '../types/types';
import {Mathematicien} from "../types/ApiTypes/mathematicien";
import {Type} from "../types/ApiTypes/type";
import {Category} from "../types/ApiTypes/category";

export const RELATION_SYMBOLS = {
    equivalence: "⇔",
    implication: "⇒",
    reciproque: "⇐",
    utilise: "utilise"
};

export const createEditableFields = (options: Record<keyof AllNodeData, string[]>): Record<keyof AllNodeData, EditableField> => ({
    type: {label: "Type", type: "select", options: options.type},
    enonce: {label: "Énoncé", type: "latex"},
    demonstration: {label: "Démonstration", type: "latex"},
    mathematicien: {label: "Mathématicien", type: "select", options: options.mathematicien},
    id: {label: "ID", type: "none"},
    nom: {label: "Nom", type: "text"},
    categorie: {label: "Catégorie", type: "select", options: options.categorie},
    aliases: {label: "Aliases", type: "alias"},
    date_ajout: {label: "Date d'ajout", type: "none"},
    relations: {label: "Relations", type: "relation"},
    sources: {label: "Sources", type: "sources"},
    verification: {label: "Vérification", type: "checkbox"},
    noms_etrangers: {label: "Noms étrangers", type: "nom_etranger"},
    tags:{label:"Tags",type:"tag"},
});
export const createMathematicienEditableFields=(options:Record<keyof Mathematicien, string[]>):Record<keyof Mathematicien, EditableField> => ({
    id: {label: "ID", type: "none"},
    nom: {label: "Nom", type: "text"},
    date_naissance: {label: "Date de naissance", type: "text"},
    date_deces: {label: "Date de décès", type: "text"},
    biographie: {label: "Biographie", type: "text"},
    nationalite: {label: "Nationalité", type: "text"},
    domaine: {label: "Domaine", type: "text"},
    url: {label: "URL", type: "text"},
    recompenses: {label: "Récompenses", type: "text"},
    epoque: {label: "Époque", type: "text"},
    created_at:{label:"Créer le",type:"none"},
    updated_at:{label:"Mis à jour le",type:"none"},
});

export const createTypeEditableFields=(options:Record<keyof Type,string[]>):Record<keyof Type, EditableField> => ({
    id: {label: "ID", type: "none"},
    type: {label: "Nom", type: "text"},
})

export const createCategoryEditableFields=(options:Record<keyof Category,string[]>):Record<keyof Category, EditableField> =>({
    id:{label: "ID", type: "none"},
    nom:{label: "Nom", type: "text"},
    description:{label: "Description", type: "text"},
    parent_id:{label: "Parent", type: "category", options: options.parent_id}
})