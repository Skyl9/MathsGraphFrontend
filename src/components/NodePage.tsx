import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../AppContext";
import {Alias, AllNodeData, NomEtranger, Relations, Source} from "../type";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import "./NodePage.css";
import "./EditNodeModal.css";
import DOMPurify from 'dompurify';

type EditableField = {
    label: string;
    type: 'text' | 'select' | "checkbox" |"none"; // 'select' pour ceux qui ont des options
    options?: string[];
};

// Créer une nouvelle variable d'état pour stocker les options récupérées


const NodePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const NomsEtrangersCollapse: React.FC<{ noms: NomEtranger[] }> = ({ noms }) => {
        const [open, setOpen] = useState(false);

        return (
            <div className="node-wrapper">
                <div className="field-title">Noms étrangers :</div>
                <button onClick={() => setOpen(prev => !prev)} className="collapse-button">
                    {open ? "Masquer" : "Afficher"}
                </button>
                {open && (
                    <div className="field-content">
                        {noms.length > 0
                            ? noms.map((n, i) => (
                                <div key={i}>{n.Nom_étranger} ({n.langue})</div>
                            ))
                            : "Aucun nom étranger"}
                    </div>
                )}
            </div>
        );
    };
    const { graphData } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AllNodeData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditField, setCurrentEditField] = useState<keyof AllNodeData | null>(null);
    const [newContent, setNewContent] = useState<string | undefined>(undefined);

    const [editableFieldsOptions, setEditableFieldsOptions] = useState<Record<keyof AllNodeData, string[]>>({
        type: [],
        enonce: [],
        demonstration: [],
        mathematicien: [],
        categorie: [],
        id: [],
        nom: [],
        aliases: [],
        date_ajout: [],
        relations: [],
        sources: [],
        verification: [],
        noms_etrangers: [],
    });

// Définir les champs modifiables
    const editableFields: Record<keyof AllNodeData, EditableField> = {
        type: { label: "Type", type: "select", options: editableFieldsOptions.type },
        enonce: { label: "Énoncé", type: "text" },
        demonstration: { label: "Démonstration", type: "text" },
        mathematicien: { label: "Mathématicien", type: "select", options: editableFieldsOptions.mathematicien },
        categorie: { label: "Catégorie", type: "select", options: editableFieldsOptions.categorie },
        id: { label: "ID", type: "none" },
        nom: { label: "Nom", type: "text" },
        aliases: { label: "Alias", type: "text" },
        date_ajout: { label: "Date d'ajout", type: "none" },
        relations: { label: "Relations", type: "text" },
        sources: { label: "Sources", type: "text" },
        verification: { label: "Vérification", type: "checkbox" },
        noms_etrangers: { label: "Noms étrangers", type: "text" }
    };

    const node = graphData?.nodes.find(n => n.id === Number(id));

    const handleChange = (value: string | number | true | string[] | Source[] | Relations[]| NomEtranger[] | {id:number,mathematicien:string} | {id:number,category:string}) => {
        if (typeof value === "number") {
            setNewContent(String(value));
        } else if (typeof value === "string") {
            setNewContent(value);
        } else {
            setNewContent(undefined);
        }
    };

    const fetchEditableFieldsOptions = async () => {
        const backendLink = process.env.REACT_APP_BACKEND_LINK || "";
        if (!backendLink) {
            setError("Lien du backend non défini");
            return;
        }

        try {
            const response = await fetch(`${backendLink}/getEditableFieldsOptions/${id}`);
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`);
                return;
            }

            const fetchedOptions = await response.json();
            setEditableFieldsOptions(fetchedOptions);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                setError(`Erreur : ${err.message}`);
            } else {
                console.error("Erreur inconnue", err);
                setError("Erreur inconnue");
            }
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const backendLink = process.env.REACT_APP_BACKEND_LINK || "";

        if (!backendLink) {
            setError("Lien du backend non défini");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendLink}/getNode/${id}`);
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`);
                return;
            }

            const fetchedData: AllNodeData = await response.json();
            setData(fetchedData);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                setError(`Erreur : ${err.message}`);
            } else {
                console.error("Erreur inconnue", err);
                setError("Erreur inconnue");
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEditableFieldsOptions();
        fetchData().catch((err) => console.error("Erreur dans useEffect:", err));

    }, [fetchData]);

    const renderRelations = (rel:string)=>{
        switch (rel){
            case "equivalence":
                return "⇔"
            case "implique":
                return "⇒"
            default:
                return rel;
        }
    }


    const saveChanges = async () => {
        if (currentEditField && newContent !== undefined) {
            const backendLink = process.env.REACT_APP_BACKEND_LINK || "";
            try {
                const response = await fetch(`${backendLink}/updateOneCategory/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        field: currentEditField,
                        value: editableFields[currentEditField]?.type === "checkbox" ? (newContent === "true") : newContent,
                    }),
                });

                if (response.ok) {
                    await fetchData();
                    setIsModalOpen(false);
                    setCurrentEditField(null);
                    setNewContent(undefined);
                } else {
                    setError("Erreur lors de la sauvegarde des modifications");
                }
            } catch (err) {
                setError("Erreur lors de la sauvegarde des modifications");
            }
        }
    };
    const renderCellContent = (field: keyof AllNodeData) => {
        const value = data?.[field];

        switch (field) {
            case "demonstration":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Démonstration :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value ?? "")),
                        }} />
                    </div>
                );
            case "enonce":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Enoncé :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value ?? "")),
                        }} />
                    </div>
                );

            case "aliases":
                console.log(value)
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Alias :</div>
                        <div className="field-content">
                            {Array.isArray(value) && value.length > 0
                                ? (value as string[]).map((a, i) => <div key={i}>{a}</div>)
                                : "Aucun alias"}
                        </div>
                    </div>
                );

            case "sources":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Sources :</div>
                        <div className="field-content">
                            {Array.isArray(value) && value.length > 0
                                ? (value as Source[]).map((s, i) => <div key={i}>{s.titre}</div>)
                                : "Aucune source"}
                        </div>
                    </div>
                );

            case "noms_etrangers":
                return <NomsEtrangersCollapse noms={Array.isArray(value) ? value as NomEtranger[] : []} />;

            case "relations":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Relations :</div>
                        <div className="field-content">
                            {Array.isArray(value) && value.length > 0
                                ? (value as Relations[]).map((s, i) => <div key={i}>{s.concept_source.nom} {renderRelations(s.type_relation)} {s.concept_cible.nom}</div>)
                                : "Aucune Relations"}
                        </div>
                    </div>
                );

            case "id":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">ID :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value)),
                        }} />
                    </div>
                );
            case "categorie":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Catégorie :</div>
                        <div className="field-content" >
                            {typeof value === "object" && value !== null && "category" in value
                                ? value.category
                                : "Aucun mathématicien"}
                        </div>
                    </div>
                );
            case "date_ajout":
                const dayjs = require('dayjs');

                const formatte = dayjs(value).format('DD-MM-YYYY HH:mm:ss');
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Date dernière modification :</div>
                        <div className="field-content" >
                            {formatte}

                        </div>
                    </div>
                );
            case "mathematicien":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Mathématicien :</div>
                        <div className="field-content">
                            {typeof value === "object" && value !== null && "mathematicien" in value
                                ? value.mathematicien
                                : "Aucun mathématicien"}
                        </div>
                    </div>
                );

            case "verification":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Vérification :</div>
                        <div className="field-content" >
                            { value ? "✅" : "❌"}
                        </div>

                    </div>
                );
            case "type":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Type :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value)),
                        }} />
                    </div>
                );
            default:
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">{field} :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value ?? "Aucune donnée")),
                        }} />
                    </div>
                );
        }
    };

    const cancelChanges = () => {
        setIsModalOpen(false);
        setCurrentEditField(null);
        setNewContent(undefined);
    };

    if (!node) return <p>Nœud introuvable.</p>;
    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="node-container">
            <h1 className="node-title">{data?.nom}</h1>

            <div className="node-info">
                {Object.entries(editableFields).map(([field, config]) => (
                    <p key={field}>
                        <div>
                            {renderCellContent(field as keyof AllNodeData)}
                        </div>
                        <button
                            className="edit-button"
                            onClick={() => {
                                setCurrentEditField(field as keyof AllNodeData);
                                handleChange(data?.[field as keyof AllNodeData] || "");
                                setIsModalOpen(true);
                            }}
                        >
                            ✏️
                        </button>
                    </p>
                ))}
            </div>

            {isModalOpen && currentEditField && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Modifier {editableFields[currentEditField].label}</h2>
                        {editableFields[currentEditField]?.type === "select" ? (
                            <select
                                value={newContent || ""}
                                onChange={(e) => setNewContent(e.target.value)}
                            >
                                {editableFields[currentEditField]?.options?.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : editableFields[currentEditField]?.type === "checkbox" ? (
                            // Si c'est un champ de type "checkbox", afficher une case à cocher
                            <input
                                type="checkbox"
                                checked={newContent === "true"}
                                onChange={(e) => setNewContent(e.target.checked ? "true" : "false")}
                            />
                        ) : (
                            // Sinon, afficher un éditeur de texte comme ReactQuill
                            <ReactQuill
                                value={newContent || ""}
                                onChange={setNewContent}
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        [{ 'align': [] }],
                                        ['bold', 'italic', 'underline'],
                                        ['link'],
                                    ],
                                }}
                            />
                        )}

                        <div className="modal-buttons">
                            <button onClick={saveChanges}>Sauvegarder</button>
                            <button onClick={cancelChanges}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="node-buttons">
                <button className="back-button" onClick={() => window.history.back()}>
                    Retour
                </button>
            </div>
        </div>
    );
};

export default NodePage;
