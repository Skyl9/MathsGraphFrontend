import { useEffect, useState } from "react";
import { NodePageSkeleton } from "../components/Skeletons";
import { Navigate, useParams } from "react-router-dom";
import { useEntityEdit } from "../hooks/useEntityEdit.ts";
import Token from "../services/token";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Button, Switch, FormControlLabel } from "@mui/material";
import { EditModal } from "../components/EditModal";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Mathematicien } from "../types/ApiTypes/mathematicien";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";
import {
  DetailsGrid,
  MainContentColumn,
  ConceptHeader,
  ConceptTitleRow,
  ConceptTitle,
  MathCard,
  MathCardHeader,
  MathCardTitle,
  MathCardBody,
  SidebarColumn,
  SidebarCard,
  SidebarCardTitle,
  MetadataList,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  SidebarActions,
} from "./NodePage.styles";

const MathematicienPage = () => {
  const { id } = useParams<{ id: string }>();
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
    refetchData,
  } = useEntityEdit<Mathematicien>("mathematicien", id || "");

  const [isUserConnected] = useState<boolean>(() => Token.isUserConnected());
  const [editModeActive, setEditModeActive] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  if (loading) return <NodePageSkeleton />;
  if (!loading && (error || !data || !data.id)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <DetailsGrid>
        {/* Colonne Principale (Gauche) */}
        <MainContentColumn>
          <ConceptHeader>
            <ConceptTitleRow>
              <ConceptTitle variant="h1">{data?.nom}</ConceptTitle>
              <FavoriteButton
                itemId={id as string}
                itemType={"mathematicien"}
              />
              {editModeActive &&
                isUserConnected &&
                editableFields["nom"] &&
                editableFields["nom"].type !== "none" && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit("nom")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
            </ConceptTitleRow>
          </ConceptHeader>

          {/* Biographie Card */}
          <MathCard cardtype="enonce">
            <MathCardHeader>
              <MathCardTitle>{t("entities.biography_title")}</MathCardTitle>
              {editModeActive &&
                isUserConnected &&
                editableFields["biographie"] &&
                editableFields["biographie"].type !== "none" && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit("biographie")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
            </MathCardHeader>
            <MathCardBody>
              <MathMarkdown
                content={data?.biographie || t("entities.no_biography")}
              />
            </MathCardBody>
          </MathCard>
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
                label={t("node.edit_mode")}
                sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
              />
            </SidebarCard>
          )}

          {/* Carte Métadonnées */}
          <SidebarCard>
            <SidebarCardTitle variant="h6">
              {t("entities.personal_info_title")}
            </SidebarCardTitle>
            <MetadataList>
              {/* ID */}
              <MetadataItem>
                <MetadataLabel>{t("entities.id_label")}</MetadataLabel>
                <MetadataValue>
                  <span>{data?.id}</span>
                </MetadataValue>
              </MetadataItem>

              {/* Date de naissance */}
              {editableFields["date_naissance"] && (
                <MetadataItem>
                  <MetadataLabel>{t("entities.birth_date")}</MetadataLabel>
                  <MetadataValue>
                    <span>{data?.date_naissance || t("entities.unknown")}</span>
                    {editModeActive &&
                      editableFields["date_naissance"].type !== "none" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit("date_naissance")}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Date de décès */}
              {editableFields["date_deces"] && (
                <MetadataItem>
                  <MetadataLabel>{t("entities.death_date")}</MetadataLabel>
                  <MetadataValue>
                    <span>
                      {data?.date_deces || t("entities.unknown_or_alive")}
                    </span>
                    {editModeActive &&
                      editableFields["date_deces"].type !== "none" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit("date_deces")}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Nationalité */}
              {editableFields["nationalite"] && (
                <MetadataItem>
                  <MetadataLabel>{t("entities.nationality")}</MetadataLabel>
                  <MetadataValue>
                    <span>{data?.nationalite || t("entities.unknown")}</span>
                    {editModeActive &&
                      editableFields["nationalite"].type !== "none" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit("nationalite")}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                  </MetadataValue>
                </MetadataItem>
              )}

              {/* Domaine */}
              {editableFields["domaine"] && (
                <MetadataItem>
                  <MetadataLabel>Domaine d'étude</MetadataLabel>
                  <MetadataValue>
                    <span>{data?.domaine || "Non classifié"}</span>
                    {editModeActive &&
                      editableFields["domaine"].type !== "none" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit("domaine")}
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
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{ borderRadius: 2 }}
              >
                Retour
              </Button>
            </SidebarActions>
          </SidebarCard>

          <ReportIssueButton />
        </SidebarColumn>
      </DetailsGrid>

      {isModalOpen && currentEditField && data && (
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
        />
      )}
    </>
  );
};

export default MathematicienPage;
