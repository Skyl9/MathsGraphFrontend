import { AllNodeData, EditableField } from '../types/types';

export const RELATION_SYMBOLS = {
    equivalence: "⇔",
    implication: "⇒",
    utilise: "utilise"
};

export const createEditableFields = (options: Record<keyof AllNodeData, string[]>): Record<keyof AllNodeData, EditableField> => ({
    type: { label: "Type", type: "select", options: options.type },
    enonce: { label: "Énoncé", type: "text" },
    demonstration: { label: "Démonstration", type: "text" },
    mathematicien: { label: "Mathématicien", type: "select", options: options.mathematicien },
    id: {label: "ID", type: "none"},
    nom: {label: "Nom", type: "text"},
    categorie: {label: "Catégorie", type: "select", options: options.categorie},
    aliases: {label: "Aliases", type: "alias"},
    date_ajout: {label: "Date d'ajout", type: "none"},
    relations: {label: "Relations", type: "relation"},
    sources: {label: "Sources", type: "sources"},
    verification: {label: "Vérification", type: "checkbox"},
    noms_etrangers: {label: "Noms étrangers", type: "nom_etranger"}
});