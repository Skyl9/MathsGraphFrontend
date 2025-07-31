import React, {useEffect} from "react";
import { useState } from "react";
import { HistoryModal } from "../components/HistoryModal";

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
import {Button, Fab, Link} from "@mui/material";
import {TopBar} from "../components/TopBar";
import Token from "../services/token";
import TagsField from "../components/NodeFields/TagsField";
import {logger} from "../utils/logger";
import {ReportIssueButton} from "../components/Issue";


const NodePage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    logger.info("NodePage rendu", { id });
    const {
        data,
        loading,
        error,
        editableFields,
        isModalOpen,
        currentEditField,
        newContent,
        setNewContent,
        handleEdit: rawHandleEdit,
        saveChanges: rawSaveChanges,
        cancelChanges: rawCancelChanges,
        setData,
        createField: rawCreateField,
        refetchData: rawRefetchData,


    } = useNodeEdit(id || "");

    const handleEdit = (field: keyof AllNodeData) => {
        logger.info("Édition démarrée", { field });
        rawHandleEdit(field);
    };
    const saveChanges = () => {
        logger.info("Sauvegarde des changements", {
            field: currentEditField,
            newContent,
        });
        rawSaveChanges();
    };

    const cancelChanges = () => {
        logger.info("Annulation des changements", { field: currentEditField });
        rawCancelChanges();
    };

    const createField = (...args: Parameters<typeof rawCreateField>) => {
        logger.debug("createField appelé", { args });
        return rawCreateField(...args);
    };

    const refetchData = async () => {
        logger.debug("RefetchData start", { id });
        try {
            await rawRefetchData();
            logger.debug("RefetchData success", { id });
        } catch (e) {
            logger.error("RefetchData error", e);
        }
    };

    const [isUserConnected, setIsUserConnected] = React.useState<boolean>(false);

    useEffect(() => {
        if (Token.getToken()) {
            setIsUserConnected(true);
            logger.debug("Utilisateur connecté détecté");
        } else {
            logger.debug("Aucun token : utilisateur non connecté");
        }
    }, []);



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
        "noms_etrangers",
        "tags"
    ];

    useEffect(() => {
        if (data) {
            logger.debug("Mise à jour state local avec data", data);
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
                            {typeof value === "object" && value !== null && "category" in value ? <Link href={"/category/redirect/"+ value.category as string}> {value.category}</Link>
                                : "Aucune Catégorie"}
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
                                ? <Link href={"/mathematicien/redirect/"+ value.mathematicien as string}> {value.mathematicien}</Link>
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
                        <Link href={"/type/redirect/" + value as string }>
                        <div className="field-content" dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(String(value)),
                        }} />
                        </Link>
                    </div>
                );
                case "tags":
                    return (
                        <TagsField tags={value}></TagsField>
                    )
            default:
                return (
                    <HtmlField title={"Défaut"} content={value as string}></HtmlField>
                );
        }
    };
    useEffect(() => {
        if (loading) {
            logger.debug("NodePage: chargement en cours...");
        }
    }, [loading]);
    useEffect(() => {
        if (error) {
            logger.warn("NodePage: erreur détectée", error);
        }
    }, [error]);
    useEffect(() => {
        if (isModalOpen) {
            logger.info("Modal d'édition ouvert", { field: currentEditField });
        } else {
            logger.info("Modal d'édition fermé");
        }
    }, [isModalOpen, currentEditField]);



    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;
    if (data === null) return (<p>Chargement</p>)

    return (
        <>
            <TopBar/>
                  <Button variant="outlined" onClick={()=>setIsHistoryOpen(true)}>
                    Voir l’historique
                  </Button>
            <HistoryModal
                    conceptId={id || ""}
                    open={isHistoryOpen}
                    onClose={()=>setIsHistoryOpen(false)}
                  />

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
                                        editableFields[field].type === "nom_etranger" ||
                                    editableFields[field].type === "tag") &&
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
                               refetchData = {refetchData}
                    ></EditModal>}

                <div className="node-buttons">
                    <button className="back-button" onClick={() => window.history.back()}>
                        Retour
                    </button>

                </div>
                <ReportIssueButton/>

            </div>
        </>
    );
};

export default NodePage;
