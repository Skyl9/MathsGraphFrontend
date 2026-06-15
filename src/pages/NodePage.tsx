import { useEffect, useState } from "react";
import { HistoryModal } from "../components/HistoryModal";

import { Navigate, useParams } from "react-router-dom";
import { AllNodeData } from "../types/types";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import { useEntityEdit } from "../hooks/useEntityEdit";
import { EditModal } from "../components/EditModal";

import { NodeFieldRenderer } from "../components/NodeFields/NodeFieldRenderer";
import CommentIcon from "@mui/icons-material/Comment";
import { CommentsModal, FieldOption } from "../components/CommentsModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Button,
  Tooltip,
  Link,
  Switch,
  FormControlLabel,
  Typography,
  IconButton,
} from "@mui/material";
import Token from "../services/token";
import { logger } from "../utils/logger";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";

import { nodeApi } from "../services/api";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";

const NodePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [editModeActive, setEditModeActive] = useState(false);

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
    handleEdit,
    saveChanges,
    cancelChanges,
    setData,
    createField,
    refetchData,
  } = useEntityEdit<AllNodeData>("concept", id || "");

  const [isUserConnected] = useState<boolean>(() => {
    const connected = Token.isUserConnected();
    if (connected) {
      logger.debug("Utilisateur connecté détecté");
    } else {
      logger.debug("Aucun token : utilisateur non connecté");
    }
    return connected;
  });

  useEffect(() => {
    if (data) {
      logger.debug("Mise à jour state local avec data", data);
      setData(data);
    }
  }, [data, setData]);

  useEffect(() => {
    if (id) {
      nodeApi.recordConceptView(id).catch((err: unknown) => {
        logger.warn("Impossible d'enregistrer la vue pour le concept", err);
      });
    }
  }, [id]);

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

  if (loading) return <p>{t("concept.loading")}</p>;
  if (!loading && (error || !data || !data.id)) {
    return <Navigate to="/404" replace />;
  }

  const commentFields: FieldOption[] = [
    { value: "nom", label: "Nom" },
    { value: "type", label: "Type" },
    { value: "enonce", label: "Enoncé" },
    { value: "category", label: "Catégorie" },
    { value: "mathematicien", label: "Mathématicien" },
    { value: "demonstration", label: "Démonstration" },
    { value: "alias", label: "Alias" },
    { value: "source", label: "Source" },
    { value: "relation", label: "Relation" },
    { value: "tag", label: "Tag" },
    { value: "Historique", label: "Historique" },
  ];

  return (
    <>
      <HistoryModal
        conceptId={id || ""}
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <CommentsModal
        open={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        conceptId={id || ""}
        fields={commentFields}
      />

      <div className="details-grid">
        {/* Colonne Principale (Gauche) */}
        <div className="main-content-column">
          <div className="concept-header">
            <div className="concept-title-row">
              <Typography className="concept-title" variant="h1">
                {data?.nom}
              </Typography>
              {data?.verification && (
                <Tooltip title={t("concept.verified")} arrow>
                  <VerifiedIcon color="primary" sx={{ fontSize: 32 }} />
                </Tooltip>
              )}
              <FavoriteButton itemId={id as string} itemType={"concept"} />
              {editModeActive && isUserConnected && editableFields["nom"] && (
                <IconButton size="small" onClick={() => handleEdit("nom")}>
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </div>

          {/* Énoncé Card */}
          {editableFields["enonce"] && (
            <div className="math-card enonce-card">
              <div className="math-card-header">
                <Typography className="math-card-title">
                  {t("concept.enonce")}
                </Typography>
                {editModeActive && isUserConnected && (
                  <IconButton size="small" onClick={() => handleEdit("enonce")}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="math-card-body">
                <MathMarkdown content={data?.enonce} />
              </div>
            </div>
          )}

          {/* Démonstration Card */}
          {editableFields["demonstration"] && (
            <div className="math-card proof-card">
              <div className="math-card-header">
                <Typography
                  className="math-card-title"
                  sx={{ color: "secondary.main" }}
                >
                  {t("concept.demonstration")}
                </Typography>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("demonstration")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="math-card-body">
                <MathMarkdown
                  content={data?.demonstration || t("concept.no_demonstration")}
                />
              </div>
            </div>
          )}

          {/* Relations Card */}
          {editableFields["relations"] && (
            <div className="math-card">
              <div className="math-card-header">
                <Typography
                  className="math-card-title"
                  sx={{ color: "text.primary" }}
                >
                  Relations
                </Typography>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("relations")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="math-card-body">
                <NodeFieldRenderer field="relations" value={data?.relations} />
              </div>
            </div>
          )}

          {/* Sources Card */}
          {editableFields["sources"] && (
            <div className="math-card">
              <div className="math-card-header">
                <Typography
                  className="math-card-title"
                  sx={{ color: "text.primary" }}
                >
                  Sources
                </Typography>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("sources")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="math-card-body">
                <NodeFieldRenderer field="sources" value={data?.sources} />
              </div>
            </div>
          )}

          {/* Aliases Card */}
          {editableFields["aliases"] && (
            <div className="math-card">
              <div className="math-card-header">
                <Typography
                  className="math-card-title"
                  sx={{ color: "text.primary" }}
                >
                  Alias
                </Typography>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("aliases")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
              <div className="math-card-body">
                <NodeFieldRenderer field="aliases" value={data?.aliases} />
              </div>
            </div>
          )}
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
              Détails du Concept
            </Typography>
            <div className="metadata-list">
              {/* Catégorie */}
              {editableFields["categorie"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Catégorie</span>
                  <div className="metadata-value">
                    <span>
                      {data?.categorie &&
                      typeof data.categorie === "object" &&
                      "category" in data.categorie ? (
                        <Link
                          href={
                            ("/category/redirect/" +
                              data.categorie.category) as string
                          }
                          underline="hover"
                        >
                          {data.categorie.category}
                        </Link>
                      ) : (
                        "Aucune"
                      )}
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("categorie")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Mathématicien */}
              {editableFields["mathematicien"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Mathématicien</span>
                  <div className="metadata-value">
                    <span>
                      {data?.mathematicien &&
                      typeof data.mathematicien === "object" &&
                      "mathematicien" in data.mathematicien ? (
                        <Link
                          href={
                            ("/mathematicien/redirect/" +
                              data.mathematicien.mathematicien) as string
                          }
                          underline="hover"
                        >
                          {data.mathematicien.mathematicien}
                        </Link>
                      ) : (
                        "Aucun"
                      )}
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("mathematicien")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Type */}
              {editableFields["type"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Type</span>
                  <div className="metadata-value">
                    <span>
                      {data?.type ? (
                        <Link
                          href={("/type/redirect/" + data.type) as string}
                          underline="hover"
                        >
                          {data.type}
                        </Link>
                      ) : (
                        "Non classifié"
                      )}
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("type")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Date d'ajout */}
              {editableFields["date_ajout"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Date d'ajout</span>
                  <div className="metadata-value">
                    <span>
                      <NodeFieldRenderer
                        field="date_ajout"
                        value={data?.date_ajout}
                      />
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("date_ajout")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Noms étrangers */}
              {editableFields["noms_etrangers"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Noms étrangers</span>
                  <div className="metadata-value">
                    <span>
                      <NodeFieldRenderer
                        field="noms_etrangers"
                        value={data?.noms_etrangers}
                      />
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("noms_etrangers")}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {editableFields["tags"] && (
                <div className="metadata-item">
                  <span className="metadata-label">Tags</span>
                  <div className="metadata-value">
                    <span>
                      <NodeFieldRenderer field="tags" value={data?.tags} />
                    </span>
                    {editModeActive && (
                      <IconButton
                        size="small"
                        onClick={() => handleEdit("tags")}
                      >
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
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={() => setIsCommentsOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Commentaires
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<HistoryIcon />}
                onClick={() => setIsHistoryOpen(true)}
                sx={{ borderRadius: 2 }}
              >
                Historique
              </Button>

              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{ borderRadius: 2, mt: 1 }}
              >
                Retour
              </Button>
            </div>
          </div>

          <ReportIssueButton />
        </div>
      </div>

      {isModalOpen && currentEditField && data && (
        <EditModal<AllNodeData>
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
        ></EditModal>
      )}
    </>
  );
};

export default NodePage;
