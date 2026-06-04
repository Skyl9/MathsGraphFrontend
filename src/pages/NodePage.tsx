import { useEffect, useState } from "react";
import { HistoryModal } from "../components/HistoryModal";

import { Navigate, useParams } from "react-router-dom";
import { AllNodeData, NomEtranger, Tag } from "../types/types";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
import { useNodeEdit } from "../hooks/node/useNodeEdit";
import { EditModal } from "../components/EditModal";
import { NomsEtrangersCollapse } from "../components/NodeFields/NomsEtrangers";
import HtmlField from "../components/NodeFields/HtmlField";
import VerifField from "../components/NodeFields/VerifField";
import DateField from "../components/NodeFields/DateField";
import AliasesField from "../components/NodeFields/AliasesField";
import SourcesField from "../components/NodeFields/SourcesField";
import RelationsField from "../components/NodeFields/RelationsField";
import CommentIcon from "@mui/icons-material/Comment";
import { CommentsModal, FieldOption } from "../components/CommentsModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import DOMPurify from "dompurify";
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
import TagsField from "../components/NodeFields/TagsField";
import { logger } from "../utils/logger";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Source } from "../types/ApiTypes/source";
import { Relations } from "../types/ApiTypes/Relations";
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
    handleChange: setNewContent,
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

  const renderCellContent = (field: keyof AllNodeData) => {
    const value = data?.[field];
    switch (field) {
      case "nom":
        return <HtmlField title={"Nom"} content={value as string}></HtmlField>;
      case "demonstration":
        return (
          <HtmlField
            title={"Démonstration"}
            content={value as string}
          ></HtmlField>
        );
      case "enonce":
        return (
          <HtmlField title={"Enoncé"} content={value as string}></HtmlField>
        );

      case "aliases":
        return <AliasesField aliases={value as string[]}></AliasesField>;

      case "sources":
        return <SourcesField sources={value as Source[]}></SourcesField>;

      case "noms_etrangers":
        return (
          <NomsEtrangersCollapse
            noms={Array.isArray(value) ? (value as NomEtranger[]) : []}
          />
        );

      case "relations":
        return (
          <RelationsField
            relations={Array.isArray(value) ? (value as Relations[]) : []}
          ></RelationsField>
        );

      case "id":
        return <HtmlField title={"Id"} content={value as string}></HtmlField>;
      case "categorie":
        return (
          <div className={"node-wrapper"}>
            <div className="field-title">{t("concept.category")}</div>
            <div className="field-content">
              {typeof value === "object" &&
              value !== null &&
              "category" in value ? (
                <Link href={("/category/redirect/" + value.category) as string}>
                  {" "}
                  {value.category}
                </Link>
              ) : (
                t("concept.no_category")
              )}
            </div>
          </div>
        );
      case "date_ajout":
        return <DateField date={value as string}></DateField>;
      case "mathematicien":
        return (
          <div className={"node-wrapper"}>
            <div className="field-title">{t("concept.mathematician")}</div>
            <div className="field-content">
              {typeof value === "object" &&
              value !== null &&
              "mathematicien" in value ? (
                <Link
                  href={
                    ("/mathematicien/redirect/" + value.mathematicien) as string
                  }
                >
                  {" "}
                  {value.mathematicien}
                </Link>
              ) : (
                t("concept.no_mathematician")
              )}
            </div>
          </div>
        );

      case "verification":
        return (
          <VerifField
            title={"Vérification"}
            value={value as string}
          ></VerifField>
        );
      case "type":
        return (
          <div className={"node-wrapper"}>
            <div className="field-title">{t("concept.type")}</div>
            <Link href={("/type/redirect/" + value) as string}>
              <div
                className="field-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(String(value)),
                }}
              />
            </Link>
          </div>
        );
      case "tags":
        return <TagsField tags={value as Tag[] | null}></TagsField>;
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
                {renderCellContent("relations")}
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
                {renderCellContent("sources")}
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
                {renderCellContent("aliases")}
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
                    <span>{renderCellContent("date_ajout")}</span>
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
                    <span>{renderCellContent("noms_etrangers")}</span>
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
                    <span>{renderCellContent("tags")}</span>
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
