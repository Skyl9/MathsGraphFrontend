import { useEffect, useState } from "react";
import { NodePageSkeleton } from "../components/Skeletons";
import { Navigate, useParams } from "react-router-dom";
import Token from "../services/token";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  IconButton,
  Button,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { EditModal } from "../components/EditModal";
import { useEntityEdit } from "../hooks/useEntityEdit.ts";
import { ReportIssueButton } from "../components/Issue";
import FavoriteButton from "../components/FavoriteButton";
import { Type } from "../types/ApiTypes/type";
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
import { SEOMeta } from "../components/SEOMeta";

const TypePage = () => {
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
  } = useEntityEdit<Type>("type", id || "");

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
      <SEOMeta
        title={data?.nom || t("search.filters.type")}
        description={`Découvrez le type ${data?.nom} sur MathGraph`}
      />
      <DetailsGrid>
        {/* Colonne Principale (Gauche) */}
        <MainContentColumn>
          <ConceptHeader>
            <ConceptTitleRow>
              <ConceptTitle variant="h1" component="h1">
                {data?.nom}
              </ConceptTitle>
              <FavoriteButton itemId={id as string} itemType={"type"} />
              {editModeActive &&
                isUserConnected &&
                editableFields["nom"] &&
                editableFields["nom"].type !== "none" && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
                    size="small"
                    color="primary"
                    onClick={() => handleEdit("nom")}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
            </ConceptTitleRow>
          </ConceptHeader>

          {/* Information Card */}
          <MathCard cardtype="enonce">
            <MathCardHeader>
              <MathCardTitle variant="h6" component="h2">
                {t("entities.type_presentation")}
              </MathCardTitle>
            </MathCardHeader>
            <MathCardBody>
              <Typography variant="body1">
                {t("entities.type_desc_1")} <strong>{data?.nom}</strong>{" "}
                {t("entities.type_desc_2")}
              </Typography>
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
            <SidebarCardTitle variant="h6" component="h2">
              {t("entities.type_details")}
            </SidebarCardTitle>
            <MetadataList>
              {/* ID */}
              <MetadataItem>
                <MetadataLabel>{t("entities.id_label")}</MetadataLabel>
                <MetadataValue>
                  <span>{data?.id}</span>
                </MetadataValue>
              </MetadataItem>
            </MetadataList>
          </SidebarCard>

          {/* Carte Actions */}
          <SidebarCard>
            <SidebarCardTitle variant="h6" component="h2">
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
        <EditModal<Type>
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

export default TypePage;
