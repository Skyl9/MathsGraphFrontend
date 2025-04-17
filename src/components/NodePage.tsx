import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {AllNodeData, Source, NomEtranger, Relations} from "../types/types";
import "./NodePage.css";
import "./EditNodeModal.css";
import {useNodeEdit} from "../hooks/useNodeEdit";
import {EditModal} from "./EditModal";
import {NomsEtrangersCollapse} from "./NodeFields/NomsEtrangers";
import HtmlField from "./NodeFields/HtmlField";
import VerifField from "./NodeFields/VerifField";
import DateField from "./NodeFields/DateField";
import ObjectField from "./NodeFields/ObjectField";
import AliasesField from "./NodeFields/AliasesField";
import SourcesField from "./NodeFields/SourcesField";
import RelationsField from "./NodeFields/RelationsField";
import DOMPurify from 'dompurify';


const NodePage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {
        data,
        loading,
        error,
        editableFields,
        isModalOpen,
        currentEditField,
        newContent,
        setNewContent,
        handleEdit,
        saveChanges,
        cancelChanges
    } = useNodeEdit(id || "");

    // Local state for editing data
    const [localData, setData] = useState<AllNodeData | null>(null);

    // Update local data when data from hook changes
    useEffect(() => {
        console.log("dataLocal",data)
        if (data) {
            setData(data);
        }
    }, [data]);


    const renderCellContent = (field: keyof AllNodeData) => {
        const value = localData?.[field];

        switch (field) {
            case "demonstration":
                return (
                    <HtmlField title={"Démonstration"} content={value as string}></HtmlField>
                );
            case "enonce":
                return (
                    <HtmlField title={"Enoncé"} content={value as string}></HtmlField>
                );

            case "aliases":
                return (
                    <AliasesField aliases={value as string[]}></AliasesField>
                );

            case "sources":
                return (
                    <SourcesField sources={value as Source[]}></SourcesField>
                );

            case "noms_etrangers":
                return <NomsEtrangersCollapse noms={Array.isArray(value) ? value as NomEtranger[] : []}/>;

            case "relations":
                return (
                    <RelationsField relations={Array.isArray(value) ? value as Relations[] : []}></RelationsField>
                );

            case "id":
                return (
                    <HtmlField title={"Id"} content={value as string}></HtmlField>
                );
            case "categorie":
                return (

                    <div className={"node-wrapper"}>
                        <div className="field-title">Catégorie :</div>
                        <div className="field-content">
                            {typeof value === "object" && value !== null && "category" in value
                                ? value.category
                                : "Aucun mathématicien"}
                        </div>
                    </div>
                );
            case "date_ajout":
                return (
                    <DateField date={value as string}></DateField>
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
                    <VerifField title={"Vérification"} value={value as string}></VerifField>
                );
            case "type":
                return (
                    <div className={"node-wrapper"}>
                        <div className="field-title">Type :</div>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value)),
                        }}/>
                    </div>
                );
            default:
                return (
                    <HtmlField title={"Défaut"} content={value as string}></HtmlField>
                );
        }
    };


    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (localData === null) return (<p>Chargement</p>)

    return (
        <div className="node-container">
            <h1 className="node-title">{localData?.nom}</h1>

            <div className="node-info">
                {Object.entries(editableFields).map(([field, config]) => (
                    <p key={field}>
                        <div>
                            {renderCellContent(field as keyof AllNodeData)}
                        </div>
                        {(config.type === 'text' || config.type === 'select' || config.type === "checkbox" || config.type === "relation" || config.type === "alias" || config.type === "sources" || config.type === "nom_etranger") && (
                            <button
                                className="edit-button"
                                onClick={() => {
                                    handleEdit(field as keyof AllNodeData);
                                }}
                            >
                                ✏️
                            </button>
                        )}
                    </p>
                ))}
            </div>

            {isModalOpen && currentEditField &&
                <EditModal isOpen={isModalOpen}
                           onClose={cancelChanges}
                           onSave={saveChanges}
                           field={currentEditField}
                           value={newContent}
                           onChange={setNewContent}
                           fieldConfig={editableFields[currentEditField]}
                           data={localData}
                ></EditModal>
            }

            <div className="node-buttons">
                <button className="back-button" onClick={() => window.history.back()}>
                    Retour
                </button>
            </div>
        </div>
    );
};

export default NodePage;
