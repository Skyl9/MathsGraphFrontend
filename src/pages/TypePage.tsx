import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Token from "../services/token";
import HtmlField from "../components/NodeFields/HtmlField";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import {Fab} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {useEntityEdit} from "../hooks/useEntityEdit.ts";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import {Type} from "../types/ApiTypes/type";


const TypePage = () => {
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
    } = useEntityEdit<Type>("type",id || "");

    const [isUserConnected, setisUserConnected] = useState<boolean>(false);
    useEffect(
        () => {
            if (Token.isUserConnected()){
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
    }, [data, setData]);


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
                return null;
        }
    }
    if (!loading && (error || !data || !data.id)) {
        return <Navigate to="/404" replace/>;
    }
    return(
    <>
        <FavoriteButton itemId={id as string} itemType={"type"}/>

        <div className="node-container">
            <h1 className="node-title">{data?.type}</h1>
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
            {isModalOpen && currentEditField && data &&
                <EditModal<Type>
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
                           refetchData={refetchData}
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

export default TypePage;