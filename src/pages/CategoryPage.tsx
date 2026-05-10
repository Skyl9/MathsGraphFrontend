import React, {useEffect} from "react";
import {TopBar} from "../components/TopBar";
import {useParams, useNavigate, Navigate} from "react-router-dom";
import Token from "../services/token";
import HtmlField from "../components/NodeFields/HtmlField";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import {Fab} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {useEntityEdit} from "../hooks/useEntityEdit";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import {nodeApi} from "../services/api";
import {Category} from "../types/ApiTypes/category";


const CategoryPage: React.FC = () => {
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
    } = useEntityEdit<Category>("category",id || "");

    const [isUserConnected, setisUserConnected] = React.useState<boolean>(false);
    const [parentCategory, setParentCategory] = React.useState<Category | null>(null);
    const navigate = useNavigate();
// redirection si l'id est invalide ou si la requête échoue


    useEffect(
        () => {
            if (Token.getToken()) {
                setisUserConnected(true);
            }
        },
        []
    )
    const propertyOrder: (keyof Category)[] = [
        "id",
        "nom",
        "description",
        "parent_id",

    ];

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data]);

    React.useEffect(() => {
        if (data && data.parent_id) {
            nodeApi.getOneCategory(data.parent_id)
                .then(setParentCategory)
                .catch(() => setParentCategory(null));
        } else {
            setParentCategory(null);
        }
    }, [data]);


    const renderCellCotnent = (field: keyof Category) => {
        switch (field) {
            case "nom":
                return (
                    <HtmlField title={"Nom"} content={data?.[field] as string}></HtmlField>
                )
            case "description":
                return (
                    <HtmlField title={"Description"} content={data?.[field] as string}></HtmlField>
                )
            case "id":
                return <HtmlField title={"Id"} content={data?.[field] as string}></HtmlField>
            case "parent_id":
                return (
                    <HtmlField
                        title="Catégorie parente"
                        content={parentCategory?.nom ?? "Aucune"}
                    />
                );
            default:
        }
    }
    if (!loading && (error || !data || !data.id)) {
        return <Navigate to="/404" replace/>;
    }

    return (
        <>
            <TopBar></TopBar>
            <FavoriteButton itemId={id as string} itemType={"category"}/>
            <div className="node-container">
                <h1 className="node-title">{data?.nom}</h1>
                {parentCategory && (
                    <div style={{marginBottom: 16}}>
                <span style={{fontStyle: "italic", color: "#666"}}>
                  Catégorie parente&nbsp;:{" "}
                    <a
                        href={`/category/${parentCategory.id}`}
                        style={{color: "#1976d2", textDecoration: "underline", cursor: "pointer"}}
                        onClick={e => {
                            e.preventDefault();
                            navigate(`/category/${parentCategory.id}`);
                        }}
                    >
                    {parentCategory.nom}
                  </a>
                </span>
                    </div>
                )}
                <div className="node-info">
                    {propertyOrder
                        .map(field => (
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

export default CategoryPage;