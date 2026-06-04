import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Token from "../services/token";
import "../styles/NodePage.css";
import "../styles/EditNodeModal.css";
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

  if (loading) return <p>{t("profile.loading")}</p>;
  if (!loading && (error || !data || !data.id)) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <div className="details-grid">
        {/* Colonne Principale (Gauche) */}
        <div className="main-content-column">
          <div className="concept-header">
            <div className="concept-title-row">
              <Typography className="concept-title" variant="h1">
                {data?.nom}
              </Typography>
              <FavoriteButton itemId={id as string} itemType={"type"} />
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
            </div>
          </div>

          {/* Information Card */}
          <div className="math-card enonce-card">
            <div className="math-card-header">
              <Typography className="math-card-title">
                {t("entities.type_presentation")}
              </Typography>
            </div>
            <div className="math-card-body">
              <Typography variant="body1">
                {t("entities.type_desc_1")} <strong>{data?.nom}</strong>{" "}
                {t("entities.type_desc_2")}
              </Typography>
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
                label={t("node.edit_mode")}
                sx={{ m: 0, width: "100%", justifyContent: "space-between" }}
              />
            </div>
          )}

          {/* Carte Métadonnées */}
          <div className="sidebar-card">
            <Typography variant="h6" className="sidebar-card-title">
              {t("entities.type_details")}
            </Typography>
            <div className="metadata-list">
              {/* ID */}
              <div className="metadata-item">
                <span className="metadata-label">{t("entities.id_label")}</span>
                <div className="metadata-value">
                  <span>{data?.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carte Actions */}
          <div className="sidebar-card">
            <Typography variant="h6" className="sidebar-card-title">
              {t("entities.actions_title")}
            </Typography>
            <div className="sidebar-actions">
              <Button
                fullWidth
                variant="text"
                startIcon={<ArrowBackIcon />}
                onClick={() => window.history.back()}
                sx={{ borderRadius: 2 }}
              >
                {t("entities.back")}
              </Button>
            </div>
          </div>

          <ReportIssueButton />
        </div>
      </div>

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
