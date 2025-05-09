import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {AllNodeData, Source, NomEtranger, Relations} from "../types/types";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import {useNodeEdit} from "../hooks/node/useNodeEdit";
import {EditModal} from "../components/EditModal";
import {NomsEtrangersCollapse} from "../components/NodeFields/NomsEtrangers";
import HtmlField from "../components/NodeFields/HtmlField";
import VerifField from "../components/NodeFields/VerifField";
import DateField from "../components/NodeFields/DateField";
import AliasesField from "../components/NodeFields/AliasesField";
import SourcesField from "../components/NodeFields/SourcesField";
import RelationsField from "../components/NodeFields/RelationsField";
import EditIcon from '@mui/icons-material/Edit';

import DOMPurify from 'dompurify';
import {Fab} from "@mui/material";
import {TopBar} from "../components/TopBar";
import Token from "../services/token";


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
        cancelChanges,
        setData,
        createField,

    } = useNodeEdit(id || "");

    const [isUserConnected, setisUserConnected] = React.useState<boolean>(false);

    useEffect(
        () => {
            if (Token.getToken()){
                setisUserConnected(true);
            }
        },
        []
    )


    // Local state for editing dataconst
    const propertyOrder: (keyof AllNodeData)[] = [
        "id",
        "nom",
        "type",
        "enonce",
        "categorie",
        "mathematicien",
        "date_ajout",
        "demonstration",
        "aliases",
        "sources",
        "relations",
        "verification",
        "noms_etrangers"
    ];


    // Update local data when data from hook changes
    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data]);


    const renderCellContent = (field: keyof AllNodeData) => {
        const value = data?.[field];

        switch (field) {
            case "nom":
                return (
                    <HtmlField title={"Nom"} content={value as string}></HtmlField>
                )
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
    if (data === null) return (<p>Chargement</p>)

    return (
        <>
            <TopBar/>
            <div className="node-container">
                <h1 className="node-title">{data?.nom}</h1>

                <div className="node-info">
                    {propertyOrder
                        .filter(field => Object.hasOwn(editableFields, field)) // S'assurer que le champ existe dans editableFields
                        .map(field => (
                            <div key={field} className="lineWrapper">
                                <div className={"field-wrapper"}>
                                    {renderCellContent(field)}
                                </div>
                                {(editableFields[field].type === 'text' ||
                                        editableFields[field].type === 'select' ||
                                        editableFields[field].type === "checkbox" ||
                                        editableFields[field].type === "relation" ||
                                        editableFields[field].type === "alias" ||
                                        editableFields[field].type === "sources" ||
                                        editableFields[field].type === "latex" ||
                                        editableFields[field].type === "nom_etranger") &&
                                    !isModalOpen
                                    && isUserConnected && (
                                        <Fab color="primary" aria-label="edit" size="small">
                                            <EditIcon
                                                className="edit_button"
                                                onClick={() => {
                                                    handleEdit(field);
                                                }}/>
                                        </Fab>
                                    )}
                            </div>
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
                               data={data}
                               setData={setData}
                               createField={createField}
                    ></EditModal>}

                <div className="node-buttons">
                    <button className="back-button" onClick={() => window.history.back()}>
                        Retour
                    </button>
                </div>
            </div>
        </>
    );
};

export default NodePage;
