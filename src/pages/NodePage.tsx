import { useEffect, useState } from "react";
import { NodePageSkeleton } from "../components/Skeletons";
import { HistoryModal } from "../components/HistoryModal";

import { Navigate, useParams } from "react-router-dom";
import { AllNodeData } from "../types/types";
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
  IconButton,
} from "@mui/material";
import Token from "../services/token";
import { logger } from "../utils/logger";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";

import { nodeApi } from "../services/api";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";

import {
  DetailsGrid,
  MainContentColumn,
  SidebarColumn,
  MathCard,
  MathCardHeader,
  MathCardTitle,
  MathCardBody,
  SidebarCard,
  SidebarCardTitle,
  MetadataList,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  ConceptHeader,
  ConceptTitleRow,
  ConceptTitle,
  SidebarActions,
} from "./NodePage.styles";

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

  if (loading) return <NodePageSkeleton />;
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

      <DetailsGrid>
        {/* Colonne Principale (Gauche) */}
        <MainContentColumn>
          <ConceptHeader>
            <ConceptTitleRow>
              <ConceptTitle variant="h1">{data?.nom}</ConceptTitle>
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
            </ConceptTitleRow>
          </ConceptHeader>

          {/* Énoncé Card */}
          {editableFields["enonce"] && (
            <MathCard cardtype="enonce">
              <MathCardHeader>
                <MathCardTitle variantcolor="primary">
                  {t("concept.enonce")}
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton size="small" onClick={() => handleEdit("enonce")}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </MathCardHeader>
              <MathCardBody>
                <MathMarkdown content={data?.enonce} />
              </MathCardBody>
            </MathCard>
          )}

          {/* Démonstration Card */}
          {editableFields["demonstration"] && (
            <MathCard cardtype="proof">
              <MathCardHeader>
                <MathCardTitle variantcolor="secondary">
                  {t("concept.demonstration")}
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("demonstration")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </MathCardHeader>
              <MathCardBody>
                <MathMarkdown
                  content={data?.demonstration || t("concept.no_demonstration")}
                />
              </MathCardBody>
            </MathCard>
          )}

          {/* Relations Card */}
          {editableFields["relations"] && (
            <MathCard>
              <MathCardHeader>
                <MathCardTitle variantcolor="default">Relations</MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("relations")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </MathCardHeader>
              <MathCardBody>
                <NodeFieldRenderer field="relations" value={data?.relations} />
              </MathCardBody>
            </MathCard>
          )}

          {/* Sources Card */}
          {editableFields["sources"] && (
            <MathCard>
              <MathCardHeader>
                <MathCardTitle variantcolor="default">Sources</MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("sources")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </MathCardHeader>
              <MathCardBody>
                <NodeFieldRenderer field="sources" value={data?.sources} />
              </MathCardBody>
            </MathCard>
          )}

          {/* Aliases Card */}
          {editableFields["aliases"] && (
            <MathCard>
              <MathCardHeader>
                <MathCardTitle variantcolor="default">Alias</MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    size="small"
                    onClick={() => handleEdit("aliases")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </MathCardHeader>
              <MathCardBody>
                <NodeFieldRenderer field="aliases" value={data?.aliases} />
              </MathCardBody>
            </MathCard>
          )}
        </MainContentColumn>

        {/* Colonne Latérale (Droite) */}
        <SidebarColumn>
          {/* Switch Mode Édition (si connecté) */}
          {isUserConnected && (
            <SidebarCard>
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
            </SidebarCard>
          )}

          {/* Carte Métadonnées */}
          <SidebarCard>
            <SidebarCardTitle variant="h6">Détails du Concept</SidebarCardTitle>
            <MetadataList>
              {/* Catégorie */}
              {editableFields["categorie"] && (
                <MetadataItem>
                  <MetadataLabel>Catégorie</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Mathématicien */}
              {editableFields["mathematicien"] && (
                <MetadataItem>
                  <MetadataLabel>Mathématicien</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Type */}
              {editableFields["type"] && (
                <MetadataItem>
                  <MetadataLabel>Type</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Date d'ajout */}
              {editableFields["date_ajout"] && (
                <MetadataItem>
                  <MetadataLabel>Date d'ajout</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Noms étrangers */}
              {editableFields["noms_etrangers"] && (
                <MetadataItem>
                  <MetadataLabel>Noms étrangers</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Tags */}
              {editableFields["tags"] && (
                <MetadataItem>
                  <MetadataLabel>Tags</MetadataLabel>
                  <MetadataValue>
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
                  </MetadataValue>
                </MetadataItem>
              )}
            </MetadataList>
          </SidebarCard>

          {/* Carte Actions */}
          <SidebarCard>
            <SidebarCardTitle variant="h6">Actions</SidebarCardTitle>
            <SidebarActions>
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
            </SidebarActions>
          </SidebarCard>

          <ReportIssueButton />
        </SidebarColumn>
      </DetailsGrid>

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
