import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import {useEntityEdit} from "../hooks/useEntityEdit.ts";
import Token from "../services/token";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {IconButton, Button, Switch, FormControlLabel, Typography} from "@mui/material";
import {EditModal} from "../components/EditModal";
import {ReportIssueButton} from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Mathematicien } from "../types/ApiTypes/mathematicien";
import MathMarkdown from "../components/MathMarkdown";

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
    } = useEntityEdit<Mathematicien>("mathematicien", id || "");

    const [isUserConnected, setIsUserConnected] = useState<boolean>(false);
    const [editModeActive, setEditModeActive] = useState<boolean>(false);

    useEffect(() => {
        if (Token.isUserConnected()){
            setIsUserConnected(true);
        }
    }, []);

    useEffect(() => {
        if (data) {
            setData(data);
        }
    }, [data, setData]);

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
                            <FavoriteButton itemId={id as string} itemType={"mathematicien"}/>
                            {editModeActive && isUserConnected && editableFields["nom"] && editableFields["nom"].type !== "none" && (
                                <IconButton size="small" color="primary" onClick={() => handleEdit("nom")}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                    </div>

                    {/* Biographie Card */}
                    <div className="math-card enonce-card">
                        <div className="math-card-header">
                            <Typography className="math-card-title">Biographie</Typography>
                            {editModeActive && isUserConnected && editableFields["biographie"] && editableFields["biographie"].type !== "none" && (
                                <IconButton size="small" color="primary" onClick={() => handleEdit("biographie")}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                        <div className="math-card-body">
                            <MathMarkdown content={data?.biographie || "Aucune biographie disponible."} />
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
                            Informations Personnelles
                        </Typography>
                        <div className="metadata-list">
                            {/* ID */}
                            <div className="metadata-item">
                                <span className="metadata-label">Identifiant</span>
                                <div className="metadata-value">
                                    <span>{data?.id}</span>
                                </div>
                            </div>

                            {/* Date de naissance */}
                            {editableFields["date_naissance"] && (
                                <div className="metadata-item">
                                    <span className="metadata-label">Date de naissance</span>
                                    <div className="metadata-value">
                                        <span>{data?.date_naissance || "Inconnue"}</span>
                                        {editModeActive && editableFields["date_naissance"].type !== "none" && (
                                            <IconButton size="small" color="primary" onClick={() => handleEdit("date_naissance")}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Date de décès */}
                            {editableFields["date_deces"] && (
                                <div className="metadata-item">
                                    <span className="metadata-label">Date de décès</span>
                                    <div className="metadata-value">
                                        <span>{data?.date_deces || "Inconnue (ou en vie)"}</span>
                                        {editModeActive && editableFields["date_deces"].type !== "none" && (
                                            <IconButton size="small" color="primary" onClick={() => handleEdit("date_deces")}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Nationalité */}
                            {editableFields["nationalite"] && (
                                <div className="metadata-item">
                                    <span className="metadata-label">Nationalité</span>
                                    <div className="metadata-value">
                                        <span>{data?.nationalite || "Inconnue"}</span>
                                        {editModeActive && editableFields["nationalite"].type !== "none" && (
                                            <IconButton size="small" color="primary" onClick={() => handleEdit("nationalite")}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Domaine */}
                            {editableFields["domaine"] && (
                                <div className="metadata-item">
                                    <span className="metadata-label">Domaine d'étude</span>
                                    <div className="metadata-value">
                                        <span>{data?.domaine || "Non classifié"}</span>
                                        {editModeActive && editableFields["domaine"].type !== "none" && (
                                            <IconButton size="small" color="primary" onClick={() => handleEdit("domaine")}>
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
                    refetchData={refetchData}
                    isSaving={false}
                />}
        </>
    );
};

export default MathematicienPage;