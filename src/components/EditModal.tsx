import { ModalProps } from "../types/types";
import { RelationEdit } from "./NodeFields/RelationEdit";
import SourceEdit from "./NodeFields/SourceEdit";
import AliasEdit from "./NodeFields/AliasEdit";
import NomEtrangerEdit from "./NodeFields/NomEtrangerEdit";
import FieldAdd from "./NodeFields/FieldAdd";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormHelperText,
} from "@mui/material";
import FieldAddAlias from "./NodeFields/FieldAddAlias";
import FieldAddRelation from "./NodeFields/FieldAddRelation";
import FieldAddSource from "./NodeFields/FieldAddSource";
import LatexEditor from "./NodeFields/LatexEditor";
import TagEdit from "./NodeFields/TagEdit";

import { useTranslation } from "react-i18next";
import { useEditModalLogic } from "../hooks/useEditModalLogic";
import { isAllNodeData, isCategory } from "../utils/typeGuards";

export const EditModal = <T extends object>({
  onClose,
  onSave,
  onSaveDraft,
  field,
  value,
  onChange,
  fieldConfig,
  data,
  createField,
  refetchData,
  isSaving,
}: ModalProps<T>) => {
  const { t } = useTranslation();

  const {
    valError,
    categories,
    handleRelationChange,
    handleSourceChange,
    handleAliasChange,
    handleNomEtrangerChange,
    handleSaveClick,
  } = useEditModalLogic({ data, field, value, onChange, onSave });

  const renderField = () => {
    const renderers: Record<string, () => React.ReactNode> = {
      category: () =>
        isCategory(data) && field === "parent_id" ? (
          <FormControl fullWidth>
            <InputLabel id="parent-select-label">
              {t("edit_modal.parent_category")}
            </InputLabel>
            <Select
              labelId="parent-select-label"
              value={value ?? ""}
              label={t("edit_modal.parent_category")}
              onChange={(e) =>
                onChange(e.target.value === "" ? null : Number(e.target.value))
              }
            >
              <MenuItem value="">{t("edit_modal.none")}</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : null,
      select: () =>
        fieldConfig.options ? (
          <FormControl fullWidth error={!!valError}>
            <InputLabel id="labelField">{fieldConfig.label}</InputLabel>
            <Select
              labelId="LabelSelection"
              id="simple-select"
              value={
                typeof value === "string" && fieldConfig.options.includes(value)
                  ? value
                  : ""
              }
              onChange={(e) => onChange(e.target.value)}
            >
              {fieldConfig.options.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {field === "type" && (
              <FieldAdd
                label={t("edit_modal.fields.type")}
                onChange={onChange}
                createField={createField}
              />
            )}
            {field === "categorie" && (
              <FieldAdd
                label={t("edit_modal.fields.category")}
                onChange={onChange}
                createField={createField}
              />
            )}
            {field === "mathematicien" && (
              <FieldAdd
                label={t("edit_modal.fields.mathematician")}
                onChange={onChange}
                createField={createField}
              />
            )}
            {valError && <FormHelperText>{valError}</FormHelperText>}
          </FormControl>
        ) : null,
      checkbox: () => (
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(value).valueOf()}
                onChange={(e) => onChange(e.target.checked)}
                name="Vérification"
              />
            }
            label={t("edit_modal.concept_verification")}
          />
        </FormControl>
      ),
      none: () => <></>,
      alias: () =>
        isAllNodeData(data) && Array.isArray(data?.aliases) && data ? (
          <div className="alias-edit-wrapper">
            {data.aliases.map((alias, index) => (
              <AliasEdit
                key={index}
                alias={alias}
                index={index}
                onChange={handleAliasChange}
              />
            ))}
            <FormControl>
              <FieldAddAlias
                createField={createField}
                onChange={onChange}
                id={data.id}
              />
            </FormControl>
          </div>
        ) : null,
      relation: () =>
        isAllNodeData(data) && Array.isArray(data?.relations) && data ? (
          <div className="relation-edit-wrapper">
            {data.relations.map((rel, index) => (
              <RelationEdit
                key={rel.id}
                relation={rel}
                onChange={(updatedRelation) =>
                  handleRelationChange(index, updatedRelation)
                }
              />
            ))}
            <FormControl>
              <FieldAddRelation
                nodeName={data.nom}
                createField={createField}
                id={data.id}
                value={null}
              />
            </FormControl>
          </div>
        ) : null,
      sources: () =>
        data && isAllNodeData(data) ? (
          <div className="source-edit-wrapper">
            {data.sources.map((src, index) => (
              <SourceEdit
                key={src.id}
                source={src}
                onChange={(updatedSource) =>
                  handleSourceChange(index, updatedSource)
                }
              />
            ))}
            <FormControl>
              <FieldAddSource createField={createField} id={data.id} />
            </FormControl>
          </div>
        ) : null,
      nom_etranger: () =>
        isAllNodeData(data) && Array.isArray(data?.noms_etrangers) && data ? (
          <div className="nom-etranger-edit-wrapper">
            {data.noms_etrangers.map((nom, index) => (
              <NomEtrangerEdit
                key={index}
                nomEtranger={nom}
                index={index}
                onChange={handleNomEtrangerChange}
              />
            ))}
          </div>
        ) : null,
      latex: () => (
        <LatexEditor
          onChange={onChange}
          text={typeof value === "string" ? value : ""}
          error={valError}
        />
      ),
      tag: () =>
        data && isAllNodeData(data) ? (
          <TagEdit
            tags={data.tags}
            conceptId={data.id.toString()}
            refetchData={refetchData}
          />
        ) : null,
      text: () => (
        <TextField
          multiline
          fullWidth
          minRows={4}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          label={fieldConfig.label}
          variant="outlined"
          error={!!valError}
          helperText={valError}
        />
      ),
      default: () => (
        <LatexEditor
          onChange={onChange}
          text={typeof value === "string" ? value : ""}
          error={valError}
        />
      ),
    };

    const renderFn = renderers[fieldConfig.type] || renderers["default"];
    return renderFn();
  };

  return (
    <Dialog
      aria-labelledby="modal-title"
      open={true}
      onClose={(_event, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      fullWidth
      maxWidth={
        ["latex", "default"].includes(fieldConfig.type) || !fieldConfig.type
          ? "md"
          : "sm"
      }
    >
      <DialogTitle id="modal-title">Modifier {fieldConfig.label}</DialogTitle>

      <DialogContent dividers>{renderField()}</DialogContent>

      <DialogActions>
        {fieldConfig.type === "tag" && data && isAllNodeData(data) ? (
          <Button onClick={onClose} color="inherit">
            Sortir
          </Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={isSaving} color="inherit">
              Annuler
            </Button>
            {onSaveDraft && (
              <Button
                onClick={onSaveDraft}
                disabled={isSaving}
                variant="outlined"
                color="secondary"
              >
                Brouillon
              </Button>
            )}
            <Button
              onClick={handleSaveClick}
              disabled={isSaving}
              variant="contained"
              color="primary"
            >
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
