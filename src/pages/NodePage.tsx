import { useEffect, useState } from "react";
import { SEOMeta } from "../components/SEOMeta";
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

import {
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import Token from "../services/token";
import { logger } from "../utils/logger";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HistoryIcon from "@mui/icons-material/History";
import CommentIcon from "@mui/icons-material/Comment";
import EditOffIcon from "@mui/icons-material/EditOff";

import FavoriteButton from "../components/FavoriteButton";

import { nodeApi } from "../services/api";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../components/SectionCard";

import {
  DetailsGrid,
  MainContentColumn,
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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
      <SEOMeta
        title={data?.nom ? data.nom : "Concept"}
        description={
          data?.enonce
            ? data.enonce.replace(/\$/g, "").substring(0, 160)
            : `Découvrez le concept mathématique de ${data?.nom || "ce graphe"} sur MathGraph.`
        }
      />

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
              <IconButton
                aria-label="Plus d'actions"
                onClick={handleMenuClick}
                sx={{ ml: "auto" }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    mt: 1.5,
                    borderRadius: "12px",
                    minWidth: "200px",
                  },
                }}
              >
                <FavoriteButton
                  itemId={id as string}
                  itemType={"concept"}
                  variant="menuItem"
                  onClickCallback={handleMenuClose}
                />

                <MenuItem
                  onClick={() => {
                    setIsCommentsOpen(true);
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <CommentIcon fontSize="small" />
                  </ListItemIcon>
                  {t("concept.comments", "Commentaires")}
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setIsHistoryOpen(true);
                    handleMenuClose();
                  }}
                >
                  <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  {t("concept.history", "Historique")}
                </MenuItem>

                {isUserConnected && (
                  <>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        setEditModeActive(!editModeActive);
                        handleMenuClose();
                      }}
                    >
                      <ListItemIcon>
                        {editModeActive ? (
                          <EditOffIcon fontSize="small" />
                        ) : (
                          <EditIcon fontSize="small" />
                        )}
                      </ListItemIcon>
                      {editModeActive
                        ? t("concept.disable_edit_mode", "Quitter l'édition")
                        : t("concept.enable_edit_mode", "Mode Édition")}
                    </MenuItem>
                  </>
                )}
              </Menu>
            </ConceptTitleRow>
          </ConceptHeader>
          {/* Énoncé Card */}
          {editableFields["enonce"] && (
            <SectionCard
              title={t("concept.enonce")}
              cardtype="enonce"
              variantcolor="primary"
              isEditable={editModeActive && isUserConnected}
              onEdit={() => handleEdit("enonce")}
            >
              <MathMarkdown content={data?.enonce} />
            </SectionCard>
          )}

          {/* Démonstration Card */}
          {editableFields["demonstration"] && (
            <SectionCard
              title={t("concept.demonstration")}
              cardtype="proof"
              variantcolor="secondary"
              isEditable={editModeActive && isUserConnected}
              onEdit={() => handleEdit("demonstration")}
            >
              <MathMarkdown
                content={data?.demonstration || t("concept.no_demonstration")}
              />
            </SectionCard>
          )}

          {/* Relations Card */}
          {editableFields["relations"] && (
            <SectionCard
              title="Relations"
              isEditable={editModeActive && isUserConnected}
              onEdit={() => handleEdit("relations")}
            >
              <NodeFieldRenderer field="relations" value={data?.relations} />
            </SectionCard>
          )}

          {/* Sources Card */}
          {editableFields["sources"] && (
            <SectionCard
              title="Sources"
              isEditable={editModeActive && isUserConnected}
              onEdit={() => handleEdit("sources")}
            >
              <NodeFieldRenderer field="sources" value={data?.sources} />
            </SectionCard>
          )}

          {/* Aliases Card */}
          {editableFields["aliases"] && (
            <SectionCard
              title="Alias"
              isEditable={editModeActive && isUserConnected}
              onEdit={() => handleEdit("aliases")}
            >
              <NodeFieldRenderer field="aliases" value={data?.aliases} />
            </SectionCard>
          )}
        </MainContentColumn>

        {/* Colonne Latérale (Droite) */}
        <NodeSidebar
          data={data || {}}
          editModeActive={editModeActive}
          isUserConnected={isUserConnected}
          editableFields={editableFields}
          handleEdit={handleEdit}
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
