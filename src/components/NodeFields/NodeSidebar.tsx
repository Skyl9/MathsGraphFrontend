/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
} from "../../pages/NodePage.styles";
import { AllNodeData, EditableField } from "../../types/types";
import { useTranslation } from "react-i18next";

interface NodeSidebarProps {
  data: Partial<AllNodeData>;
  editModeActive: boolean;
  isUserConnected: boolean;
  editableFields: Record<string, EditableField>;
  handleEdit: (field: any) => void;
}

export const NodeSidebar = ({
  data,
  editModeActive,
  editableFields,
  handleEdit,
}: NodeSidebarProps) => {
  const { t } = useTranslation();

  return (
    <SidebarColumn>
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
                    aria-label={t("common.edit")}
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
                    aria-label={t("common.edit")}
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
                    aria-label={t("common.edit")}
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
                    aria-label={t("common.edit")}
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
                    aria-label={t("common.edit")}
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

      <ReportIssueButton />
    </SidebarColumn>
  );
};
