import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NodePageSkeleton } from "../components/Skeletons";
import { HistoryModal } from "../components/HistoryModal";

import { Navigate, useParams } from "react-router-dom";
import { AllNodeData } from "../types/types";
import { useEntityEdit } from "../hooks/useEntityEdit";
import { EditModal } from "../components/EditModal";

import { NodeFieldRenderer } from "../components/NodeFields/NodeFieldRenderer";
import { NodeSidebar } from "../components/NodeFields/NodeSidebar";

import { CommentsModal, FieldOption } from "../components/CommentsModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import EditIcon from "@mui/icons-material/Edit";

import { Tooltip, IconButton } from "@mui/material";
import Token from "../services/token";
import { logger } from "../utils/logger";

import FavoriteButton from "../components/FavoriteButton";

import { nodeApi } from "../services/api";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";

import {
  DetailsGrid,
  MainContentColumn,
  MathCard,
  MathCardHeader,
  MathCardTitle,
  MathCardBody,
  ConceptHeader,
  ConceptTitleRow,
  ConceptTitle,
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
      <Helmet>
        <title>
          {data?.nom ? `${data.nom} | MathGraph` : "Concept | MathGraph"}
        </title>
        <meta
          name="description"
          content={
            data?.enonce
              ? data.enonce.replace(/\$/g, "").substring(0, 160)
              : `Découvrez le concept mathématique de ${data?.nom || "ce graphe"} sur MathGraph.`
          }
        />
        <meta
          property="og:title"
          content={data?.nom ? `${data.nom} | MathGraph` : "Concept"}
        />
        <meta
          property="og:description"
          content={
            data?.enonce
              ? data.enonce.replace(/\$/g, "").substring(0, 160)
              : `Explorez le concept ${data?.nom || "mathématique"}.`
          }
        />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={data?.nom ? `${data.nom} | MathGraph` : "Concept"}
        />
        <meta
          name="twitter:description"
          content={
            data?.enonce
              ? data.enonce.replace(/\$/g, "").substring(0, 160)
              : `Explorez le concept ${data?.nom || "mathématique"}.`
          }
        />
      </Helmet>

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
                <IconButton
                  aria-label={t("common.aria.action_button")}
                  size="small"
                  onClick={() => handleEdit("nom")}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </ConceptTitleRow>
          </ConceptHeader>
          {/* Énoncé Card */}
          {editableFields["enonce"] && (
            <MathCard cardtype="enonce">
              <MathCardHeader>
                <MathCardTitle
                  variantcolor="primary"
                  variant="h6"
                  component="h2"
                >
                  {t("concept.enonce")}
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
                    size="small"
                    onClick={() => handleEdit("enonce")}
                  >
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
                <MathCardTitle
                  variantcolor="secondary"
                  variant="h6"
                  component="h2"
                >
                  {t("concept.demonstration")}
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
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
                <MathCardTitle
                  variantcolor="default"
                  variant="h6"
                  component="h2"
                >
                  Relations
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
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
                <MathCardTitle
                  variantcolor="default"
                  variant="h6"
                  component="h2"
                >
                  Sources
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
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
                <MathCardTitle
                  variantcolor="default"
                  variant="h6"
                  component="h2"
                >
                  Alias
                </MathCardTitle>
                {editModeActive && isUserConnected && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
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
        <NodeSidebar
          data={data || {}}
          editModeActive={editModeActive}
          setEditModeActive={setEditModeActive}
          isUserConnected={isUserConnected}
          editableFields={editableFields}
          handleEdit={handleEdit}
          setIsCommentsOpen={setIsCommentsOpen}
          setIsHistoryOpen={setIsHistoryOpen}
        />
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
