import {useEffect, useState} from "react";
import {useParams, useNavigate, Navigate} from "react-router-dom";
import Token from "../services/token";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {IconButton, Button, Switch, FormControlLabel, Typography} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {useEntityEdit} from "../hooks/useEntityEdit";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import {nodeApi} from "../services/api";
import {Category} from "../types/ApiTypes/category";
import MathMarkdown from "../components/MathMarkdown";

const CategoryPage = () => {
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
    } = useEntityEdit<Category>("category", id || "");

    const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
    const [parentCategory, setParentCategory] = useState<Category | null>(null);
    const [editModeActive, setEditModeActive] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (Token.isUserConnected()) {
            setIsUserConnected(true);
        }
    }, []);

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data, setData]);

    useEffect(() => {
        if (data && data.parent_id) {
            nodeApi.getOneCategory(data.parent_id)
                .then(setParentCategory)
                .catch(() => setParentCategory(null));
        } else {
            setParentCategory(null);
        }
    }, [data]);

    if (loading) return <p>Chargement...</p>;
    if (!loading && (error || !data || !data.id)) {
        return <Navigate to="/404" replace/>;
    }

    return (
        <>
            <div className="details-grid">
                {/* Colonne Principale (Gauche) */}
                <div className="main-content-column">
                    <div className="concept-header">
                        <div className="concept-title-row">
                            <Typography className="concept-title" variant="h1">{data?.nom}</Typography>
                            <FavoriteButton itemId={id as string} itemType={"category"}/>
                            {editModeActive && isUserConnected && editableFields["nom"] && editableFields["nom"].type !== "none" && (
                                <IconButton size="small" color="primary" onClick={() => handleEdit("nom")}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="math-card enonce-card">
                        <div className="math-card-header">
                            <Typography className="math-card-title">Description</Typography>
                            {editModeActive && isUserConnected && editableFields["description"] && editableFields["description"].type !== "none" && (
                                <IconButton size="small" color="primary" onClick={() => handleEdit("description")}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                        <div className="math-card-body">
                            <MathMarkdown content={data?.description || "Aucune description disponible."} />
                        </div>
                    </div>
                </div>

                {/* Colonne Latérale (Droite) */}
                <div className="sidebar-column">
                    {/* Switch Mode Édition (si connecté) */}
                    {isUserConnected && (
                        <div className="sidebar-card">
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editModeActive}
                                        onChange={(e) => setEditModeActive(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Mode Édition"
                                sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
                            />
                        </div>
                    )}

                    {/* Carte Métadonnées */}
                    <div className="sidebar-card">
                        <Typography variant="h6" className="sidebar-card-title">
                            Détails de la Catégorie
                        </Typography>
                        <div className="metadata-list">
                            {/* ID */}
                            <div className="metadata-item">
                                <span className="metadata-label">Identifiant</span>
                                <div className="metadata-value">
                                    <span>{data?.id}</span>
                                </div>
                            </div>

                            {/* Catégorie Parente */}
                            {editableFields["parent_id"] && (
                                <div className="metadata-item">
                                    <span className="metadata-label">Catégorie Parente</span>
                                    <div className="metadata-value">
                                        <span>
                                            {parentCategory ? (
                                                <a
                                                    href={`/category/${parentCategory.id}`}
                                                    style={{ color: "#0ea5e9", textDecoration: "underline", cursor: "pointer" }}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        navigate(`/category/${parentCategory.id}`);
                                                    }}
                                                >
                                                    {parentCategory.nom}
                                                </a>
                                            ) : (
                                                "Aucune"
                                            )}
                                        </span>
                                        {editModeActive && editableFields["parent_id"].type !== "none" && (
                                            <IconButton size="small" color="primary" onClick={() => handleEdit("parent_id")}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Carte Actions */}
                    <div className="sidebar-card">
                        <Typography variant="h6" className="sidebar-card-title">
                            Actions
                        </Typography>
                        <div className="sidebar-actions">
                            <Button
                                fullWidth
                                variant="text"
                                startIcon={<ArrowBackIcon />}
                                onClick={() => window.history.back()}
                                sx={{ borderRadius: 2 }}
                            >
                                Retour
                            </Button>
                        </div>
                    </div>

                    <ReportIssueButton />
                </div>
            </div>

            {isModalOpen && currentEditField && data &&
                <EditModal<Category>
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
                />}
        </>
    );
};

export default CategoryPage;