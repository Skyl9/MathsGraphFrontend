import { useEffect, useState } from "react";
import { NodePageSkeleton } from "../components/Skeletons";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useEntityEdit } from "../hooks/useEntityEdit.ts";
import Token from "../services/token";
import "../styles/EditNodeModal.css";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Button, Switch, FormControlLabel } from "@mui/material";
import { EditModal } from "../components/EditModal";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Category } from "../types/ApiTypes/category";
import MathMarkdown from "../components/MathMarkdown";
import { useTranslation } from "react-i18next";
import { nodeApi } from "../services/api";
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

const CategoryPage = () => {
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
  } = useEntityEdit<Category>("category", id || "");

  const [isUserConnected] = useState<boolean>(() => Token.isUserConnected());
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [prevParentId, setPrevParentId] = useState<
    string | number | null | undefined
  >(undefined);
  const [editModeActive, setEditModeActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (data) {
      setData(data);
    }
  }, [data, setData]);

  if (data?.parent_id !== prevParentId) {
    setPrevParentId(data?.parent_id);
    if (data?.parent_id) {
      nodeApi
        .getOneCategory(data.parent_id as string)
        .then(setParentCategory)
        .catch(() => setParentCategory(null));
    } else {
      setParentCategory(null);
    }
  }

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
              <FavoriteButton itemId={id as string} itemType={"category"} />
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

          {/* Description Card */}
          <MathCard cardtype="enonce">
            <MathCardHeader>
              <MathCardTitle>{t("entities.description_title")}</MathCardTitle>
              {editModeActive &&
                isUserConnected &&
                editableFields["description"] &&
                editableFields["description"].type !== "none" && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit("description")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
            </MathCardHeader>
            <MathCardBody>
              <MathMarkdown
                content={data?.description || t("entities.no_description")}
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
              {t("entities.category_details")}
            </SidebarCardTitle>
            <MetadataList>
              {/* ID */}
              <MetadataItem>
                <MetadataLabel>{t("entities.id_label")}</MetadataLabel>
                <MetadataValue>
                  <span>{data?.id}</span>
                </MetadataValue>
              </MetadataItem>

              {/* Catégorie Parente */}
              {editableFields["parent_id"] && (
                <MetadataItem>
                  <MetadataLabel>
                    {t("entities.parent_category_label")}
                  </MetadataLabel>
                  <MetadataValue>
                    <span>
                      {parentCategory ? (
                        <a
                          href={`/category/${parentCategory.id}`}
                          style={{
                            color: "#0ea5e9",
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/category/${parentCategory.id}`);
                          }}
                        >
                          {parentCategory.nom}
                        </a>
                      ) : (
                        t("entities.none")
                      )}
                    </span>
                    {editModeActive &&
                      editableFields["parent_id"].type !== "none" && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit("parent_id")}
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
            <SidebarCardTitle variant="h6">
              {t("entities.actions_title")}
            </SidebarCardTitle>
            <SidebarActions>
              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{ borderRadius: 2 }}
              >
                {t("entities.back")}
              </Button>
            </SidebarActions>
          </SidebarCard>

          <ReportIssueButton />
        </SidebarColumn>
      </DetailsGrid>

      {isModalOpen && currentEditField && data && (
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
        />
      )}
    </>
  );
};

export default CategoryPage;
