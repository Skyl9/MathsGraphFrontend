import React, {useEffect} from "react";
import {TopBar} from "../components/TopBar";
import {useParams} from "react-router-dom";
import Token from "../services/token";
import { Type} from "../types/types";
import HtmlField from "../components/NodeFields/HtmlField";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import {Fab} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {useTypeEdit} from "../hooks/type/useTypeEdit";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";


const TypePage : React.FC = () => {
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
    } = useTypeEdit(id || "");

    const [isUserConnected, setisUserConnected] = React.useState<boolean>(false);
    useEffect(
        () => {
            if (Token.getToken()){
                setisUserConnected(true);
            }
        },
        []
    )
    const propertyOrder: (keyof Type)[] = [
        "id",
        "type",
    ];

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data]);


    const renderCellCotnent =(field: keyof Type) => {
        const value = data?.[field]
        switch (field){
            case "type":
                return (
                    <HtmlField title={"Type"} content={value as string}></HtmlField>
                )
            case "id":
                return <HtmlField title={"Id"} content={value as string}></HtmlField>
            default:
        }
    }

    return(
    <>
    <TopBar></TopBar>
        <FavoriteButton itemId={id as string} itemType={"type"}/>

        <div className="node-container">
            <h1 className="node-title">{data?.nom}</h1>
            <div className="node-info">
                {propertyOrder
                    .map(field =>(
                        <div key={field} className={"lineWrapper"}>
                            <div className={"field-wrapper"}>
                                {renderCellCotnent(field)}
                            </div>
                                {(editableFields[field].type !== "none" && !isModalOpen && isUserConnected) && (
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
                           refetchData={refetchData}
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

export default TypePage;