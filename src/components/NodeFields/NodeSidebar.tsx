import { Switch, FormControlLabel, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ReportIssueButton } from "../Issue";
import { NodeFieldRenderer } from "./NodeFieldRenderer";
import {
  SidebarColumn,
  SidebarCard,
  SidebarCardTitle,
  MetadataList,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  SidebarActions,
} from "../../pages/NodePage.styles";
import { AllNodeData, EditableField } from "../../types/types";
import { useTranslation } from "react-i18next";

interface NodeSidebarProps {
  data: Partial<AllNodeData>;
  editModeActive: boolean;
  setEditModeActive: (val: boolean) => void;
  isUserConnected: boolean;
  editableFields: Record<string, EditableField>;
  handleEdit: (field: any) => void;
  setIsCommentsOpen: (val: boolean) => void;
  setIsHistoryOpen: (val: boolean) => void;
}

export const NodeSidebar = ({
  data,
  editModeActive,
  setEditModeActive,
  isUserConnected,
  editableFields,
  handleEdit,
  setIsCommentsOpen,
  setIsHistoryOpen,
}: NodeSidebarProps) => {
  const { t } = useTranslation();

  return (
    <SidebarColumn>
      {/* Mode Edition */}
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
            label={t("concept.edit_mode")}
            sx={{
              m: 0,
              width: "100%",
              "& .MuiFormControlLabel-label": { fontWeight: 600 },
            }}
          />
        </SidebarCard>
      )}

      {/* Carte Métadonnées */}
      <SidebarCard>
        <SidebarCardTitle variant="h6" component="h2">
          Métadonnées
        </SidebarCardTitle>
        <MetadataList>
          {/* Identifiant */}
          <MetadataItem>
            <MetadataLabel>ID</MetadataLabel>
            <MetadataValue>{data?.id}</MetadataValue>
          </MetadataItem>

          {/* Catégorie */}
          {editableFields["categorie"] && (
            <MetadataItem>
              <MetadataLabel>Catégorie</MetadataLabel>
              <MetadataValue>
                <span>
                  {data?.categorie ? (
                    <NodeFieldRenderer
                      field="categorie"
                      value={data?.categorie}
                    />
                  ) : (
                    "Aucune catégorie"
                  )}
                </span>
                {editModeActive && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
                    size="small"
                    onClick={() => handleEdit("categorie")}
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
                    <NodeFieldRenderer field="type" value={data?.type} />
                  ) : (
                    "Aucun type"
                  )}
                </span>
                {editModeActive && (
                  <IconButton
                    aria-label={t("common.aria.action_button")}
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
                    aria-label={t("common.aria.action_button")}
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
                    aria-label={t("common.aria.action_button")}
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
                    aria-label={t("common.aria.action_button")}
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
        <SidebarCardTitle variant="h6" component="h2">
          Actions
        </SidebarCardTitle>
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
  );
};
