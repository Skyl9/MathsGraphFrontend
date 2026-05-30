import {useEffect, useState} from 'react';
import {AllNodeData, ModalProps, NomEtranger,} from "../types/types";
import {RelationEdit} from './NodeFields/RelationEdit';
import SourceEdit from './NodeFields/SourceEdit';
import AliasEdit from './NodeFields/AliasEdit';
import NomEtrangerEdit from './NodeFields/NomEtrangerEdit';
import FieldAdd from "./NodeFields/FieldAdd"
import {Alert, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField} from "@mui/material";
import FieldAddAlias from "./NodeFields/FieldAddAlias";
import FieldAddRelation from "./NodeFields/FieldAddRelation";
import FieldAddSource from "./NodeFields/FieldAddSource";
import LatexEditor from "./NodeFields/LatexEditor";
import TagEdit from "./NodeFields/TagEdit";
import {nodeApi} from "../services/api";
import {Mathematicien} from '../types/ApiTypes/mathematicien';
import {Category} from "../types/ApiTypes/category";
import {Relations} from "../types/ApiTypes/Relations";
import {Source} from "../types/ApiTypes/source";
import {validateField} from "../validations/schemas.ts";


export const EditModal = <T extends object>({
                                                    onClose,
                                                    onSave,
                                                    field,
                                                    value,
                                                    onChange,
                                                    fieldConfig,
                                                    data,
                                                    setData,
                                                    createField,
                                                    refetchData, isSaving
                                                }: ModalProps<T>) => {
    const [valError, setValError] = useState<string | null>(null);
    const isAllNodeData = (data: unknown): data is AllNodeData => {
        return !!data && typeof data === 'object' && 'relations' in data;
    };

    const isMathematicien = (data: unknown): data is Mathematicien => {
        return !!data && typeof data === 'object' && 'nationalite' in data;
    };

    const isCategory = (d: unknown): d is Category =>
        !!d && typeof d === 'object' && 'parent_id' in d;

    // Pour les relations
    const handleRelationChange = (index: number, updatedRelation: Relations) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.relations];
            updated[index] = updatedRelation;
            (setData as unknown as (data: AllNodeData) => void)({...data, relations: updated});
        }
    };

    // Pour les sources
    const handleSourceChange = (index: number, updatedSource: Source) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.sources];
            updated[index] = updatedSource;
            (setData as unknown as (data: AllNodeData) => void)({...data, sources: updated});
        }
    };
    const handleSaveClick = () => {
        // 1. Identifier sur quelle entité on se trouve
        let entityType: "concept" | "mathematicien" | "category" | "type" | null = null;
        if (isAllNodeData(data)) entityType = "concept";
        else if (isMathematicien(data)) entityType = "mathematicien";
        else if (isCategory(data)) entityType = "category";
        else if (data && typeof data === 'object' && 'type' in data) entityType = "type";

        // 2. Si on a trouvé une entité et qu'on modifie du texte, on valide avec Zod
        if (entityType && typeof value === "string") {
            const valRes = validateField(entityType, field as string, value);
            if (!valRes.success) {
                setValError(valRes.error as string |null);
                return;
            }
        }

        // 🟢 Tout est valide ! On efface l'erreur visuelle et on lance la sauvegarde du Hook
        setValError(null);
        onSave();
    };
    // Pour les alias
    const handleAliasChange = (index: number, value: string) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.aliases];
            updated[index] = value;
            (setData as unknown as (data: AllNodeData) => void)({...data, aliases: updated});
        }
    };

    // Pour les noms étrangers
    const handleNomEtrangerChange = (index: number, updatedNom: NomEtranger) => {
        if (data && isAllNodeData(data)) {
            if (data.noms_etrangers) {
                const updated = [...data.noms_etrangers];
                updated[index] = updatedNom;
                (setData as unknown as (data: AllNodeData) => void)({...data, noms_etrangers: updated});
            }
        }
    };
    const [categories, setCategories] = useState<Category[]>([]);

    // Charger les catégories existantes pour le sélecteur parent_id
    useEffect(() => {
        if (field === "parent_id" && isCategory(data)) {
            nodeApi.getAllCategories()
                .then(setCategories)
                .catch(() => setCategories([]));
        }
    }, [field, data]);


    const renderField = () => {
        const renderers: Record<string, () => React.ReactNode> = {
            "category": () => isCategory(data) && field === "parent_id" ? (
                <FormControl fullWidth>
                    <InputLabel id="parent-select-label">Catégorie parente</InputLabel>
                    <Select
                        labelId="parent-select-label"
                        value={value ?? ""}
                        label="Catégorie parente"
                        onChange={e => onChange(e.target.value === "" ? null : Number(e.target.value))}
                    >
                        <MenuItem value="">Aucune</MenuItem>
                        {categories.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>{cat.nom}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ) : null,
            "select": () => fieldConfig.options ? (
                <FormControl fullWidth>
                    <InputLabel id="labelField">{fieldConfig.label}</InputLabel>
                    <Select
                        labelId="LabelSelection"
                        id="simple-select"
                        value={typeof value === 'string' && fieldConfig.options.includes(value) ? value : ''}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        {fieldConfig.options.map((option, index) => (
                            <MenuItem key={index} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                    {field === "type" && <FieldAdd label="Type" onChange={onChange} createField={createField} />}
                    {field === "categorie" && <FieldAdd label="categorie" onChange={onChange} createField={createField} />}
                    {field === "mathematicien" && <FieldAdd label="mathematicien" onChange={onChange} createField={createField} />}
                </FormControl>
            ) : null,
            "checkbox": () => (
                <FormControl>
                    <FormControlLabel 
                        control={<Switch checked={Boolean(value).valueOf()} onChange={(e) => onChange(e.target.checked)} name="Vérification"/>} 
                        label="Vérification du concept" 
                    />
                </FormControl>
            ),
            "none": () => <></>,
            "alias": () => isAllNodeData(data) && Array.isArray(data?.aliases) && data ? (
                <div className="alias-edit-wrapper">
                    {data.aliases.map((alias, index) => (
                        <AliasEdit key={index} alias={alias} index={index} onChange={handleAliasChange} />
                    ))}
                    <FormControl>
                        <FieldAddAlias createField={createField} onChange={onChange} id={data.id} />
                    </FormControl>
                </div>
            ) : null,
            "relation": () => isAllNodeData(data) && Array.isArray(data?.relations) && data ? (
                <div className="relation-edit-wrapper">
                    {data.relations.map((rel, index) => (
                        <RelationEdit key={rel.id} relation={rel} onChange={(updatedRelation) => handleRelationChange(index, updatedRelation)} />
                    ))}
                    <FormControl>
                        <FieldAddRelation nodeName={data.nom} createField={createField} id={data.id} value={null} />
                    </FormControl>
                </div>
            ) : null,
            "sources": () => data && isAllNodeData(data) ? (
                <div className="source-edit-wrapper">
                    {data.sources.map((src, index) => (
                        <SourceEdit key={src.id} source={src} onChange={(updatedSource) => handleSourceChange(index, updatedSource)} />
                    ))}
                    <FormControl>
                        <FieldAddSource createField={createField} id={data.id} />
                    </FormControl>
                </div>
            ) : null,
            "nom_etranger": () => isAllNodeData(data) && Array.isArray(data?.noms_etrangers) && data ? (
                <div className="nom-etranger-edit-wrapper">
                    {data.noms_etrangers.map((nom, index) => (
                        <NomEtrangerEdit key={index} nomEtranger={nom} index={index} onChange={handleNomEtrangerChange} />
                    ))}
                </div>
            ) : null,
            "latex": () => <LatexEditor onChange={onChange} text={typeof value === 'string' ? value : ""} />,
            "tag": () => data && isAllNodeData(data) ? (
                <TagEdit tags={data.tags} conceptId={data.id.toString()} refetchData={refetchData} />
            ) : null,
            "text": () => (
                <TextField
                    multiline
                    fullWidth
                    minRows={4}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    label={fieldConfig.label}
                    variant="outlined"
                />
            ),
            "default": () => (
                <TextField
                    label={`Modifier ${fieldConfig.label} (Markdown & LaTeX)`}
                    multiline
                    fullWidth
                    minRows={8}
                    maxRows={15}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    variant="outlined"
                    placeholder="Rédigez ici... Utilisez **gras**, *italique*, et $x^2$ pour les maths."
                />
            )
        };

        const renderFn = renderers[fieldConfig.type] || renderers["default"];
        return renderFn();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Modifier {fieldConfig.label}</h2>
                {valError && <Alert severity="error" sx={{ mb: 2 }}>{valError}</Alert>}
                
                {renderField()}

                {fieldConfig.type === "tag" && data && isAllNodeData(data) ? (
                    <div className="modal-buttons">
                        <button onClick={onClose}>Sortir</button>
                    </div>

                ) : (
                    <div className="modal-buttons">
                        <button onClick={handleSaveClick}
                                disabled={isSaving}
                        >{isSaving ? "Sauvegarde..." : "Sauvegarder"}</button>
                        <button onClick={onClose} disabled={isSaving} >Annuler</button>
                    </div>
                )}

            </div>
        </div>
    );
};