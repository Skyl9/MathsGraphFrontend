import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useEntityEdit} from "../hooks/useEntityEdit.ts";
import Token from "../services/token";
import HtmlField from "../components/NodeFields/HtmlField";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import {Fab} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Mathematicien } from "../types/ApiTypes/mathematicien";


const MathematicienPage = () => {
    const {id} = useParams<{ id: string }>();
    const {
        data,
        loading,
        error,
        isModalOpen,
        currentEditField,
        newContent,
        setNewContent,
        handleEdit,
        cancelChanges,
        setData,
        editableFields,
        createField,
        saveChanges,
        refetchData
} = useEntityEdit<Mathematicien>("mathematicien",id || "");

    const [isUserConnected, setisUserConnected] = useState<boolean>(false);
    useEffect(
        () => {
            if (Token.isUserConnected()){
                setisUserConnected(true);
            }
        },
        []
    )
    const propertyOrder: (keyof Mathematicien)[] = [
        "id",
        "nom",
        "date_naissance",
        "date_deces",
        "biographie",
        "nationalite",
        "domaine",


    ];

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data, setData]);


    const renderCellCotnent =(field: keyof Mathematicien) => {
        const value = data?.[field]
        switch (field){
            case "nom":
                return (
                    <HtmlField title={"Nom"} content={value as string}></HtmlField>
                )
            case "date_naissance":
                return(
                    <HtmlField title={"Date de naissance"} content={value as string}></HtmlField>
                )
            case "date_deces":
                return(
                    <HtmlField content={value as string} title={"Date de Décès"}/>
                )
            case "biographie":
                return(
                    <HtmlField title={"Biographie"} content={value as string}></HtmlField>
                )
            case "nationalite":
                return (
                    <HtmlField content={value as string} title={"Nationalité"}/>
                )
            case "domaine":
                return(
                    <HtmlField title={"Domaine"} content={value as string}></HtmlField>
                )
            case "id":
                return <HtmlField title={"Id"} content={value as string}></HtmlField>
            default:
                return null;
        }
    }
    if (!loading && (error || !data || !data.id)) {
        return <Navigate to="/404" replace/>;
    }
    return(
    <>
        <FavoriteButton itemId={id as string} itemType={"mathematicien"}/>
        <div className="node-container">
            <h1 className="node-title">{data?.nom}</h1>
            <div className="node-info">
                {propertyOrder
                    .map(field =>(
                        <div key={field} className={"lineWrapper"}>
                            <div className={"field-wrapper"}>
                                {renderCellCotnent(field)}
                            </div>
                                {(editableFields[field].type != "none" && !isModalOpen && isUserConnected) && (
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
            {isModalOpen && currentEditField && data &&
                <EditModal<Mathematicien>
                           isOpen={isModalOpen}
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
                           isSaving={false}
                ></EditModal>}

            <div className="node-buttons">
                <button className="back-button" onClick={() => window.history.back()}>
                    Retour
                </button>
            </div>
            <ReportIssueButton/>
        </div>

    </>
    )
}

export default MathematicienPage;