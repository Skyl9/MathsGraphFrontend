import React from 'react';
import {AllNodeData, Mathematicien, ModalProps, NomEtranger, Relations, Source, Tag} from "../types/types";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import {RelationEdit} from './NodeFields/RelationEdit';
import SourceEdit from './NodeFields/SourceEdit';
import AliasEdit from './NodeFields/AliasEdit';
import NomEtrangerEdit from './NodeFields/NomEtrangerEdit';
import FieldAdd from "./NodeFields/FieldAdd"
import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField} from "@mui/material";
import FieldAddAlias from "./NodeFields/FieldAddAlias";
import FieldAddRelation from "./NodeFields/FieldAddRelation";
import FieldAddSource from "./NodeFields/FieldAddSource";
import LatexEditor from "./NodeFields/LatexEditor";
import TagEdit from "./NodeFields/TagEdit";

// TODO Mettre en place le lien sur les sources et plus généralement les liens de la page d'informations
//TODO Mettre en place les boutons de suppressions d'éléments

export const EditModal: React.FC<ModalProps> = ({
                                                    onClose,
                                                    onSave,
                                                    field,
                                                    value,
                                                    onChange,
                                                    fieldConfig,
                                                    data,
                                                    setData,
                                                    createField,
                                                    refetchData
                                                }) => {
    const isAllNodeData = (data: unknown): data is AllNodeData => {
        return !!data && typeof data === 'object' && 'relations' in data;
    };

    const isMathematiciens = (data: unknown): data is Mathematicien => {
        return !!data && typeof data === 'object' && 'nationalite' in data;
    };


    // Pour les relations
    const handleRelationChange = (index: number, updatedRelation: Relations) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.relations];
            updated[index] = updatedRelation;
            setData({...data, relations: updated});
        }
    };

    // Pour les sources
    const handleSourceChange = (index: number, updatedSource: Source) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.sources];
            updated[index] = updatedSource;
            setData({...data, sources: updated});
        }
    };

    // Pour les alias
    const handleAliasChange = (index: number, value: string) => {
        if (data && isAllNodeData(data)) {
            const updated = [...data.aliases];
            updated[index] = value
            setData({...data, aliases: updated});
        }
    };

    // Pour les noms étrangers
    const handleNomEtrangerChange = (index: number, updatedNom: NomEtranger) => {
        if (data && isAllNodeData(data)) {
            if (data.noms_etrangers) {
                const updated = [...data.noms_etrangers];
                updated[index] = updatedNom;
                setData({...data, noms_etrangers: updated});
            }
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Modifier {fieldConfig.label}</h2>
                {fieldConfig.type === "select" && fieldConfig.options ? (
                    <FormControl fullWidth>
                        <InputLabel id="labelField">{fieldConfig.label}</InputLabel>
                        <Select
                            labelId="LabelSelection"
                            id="simple-select"
                            value={fieldConfig.options.includes(value) ? value : ''}
                            onChange={(e) => onChange(e.target.value)}
                        >
                            {fieldConfig.options?.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {field === "type" && fieldConfig.type === "select" && (
                            <FieldAdd
                                label="Type"
                                onChange={onChange}
                                createField={createField}
                            />
                        )}
                        {field === "categorie" && fieldConfig.type === "select" && (
                            <FieldAdd
                                label="categorie"
                                onChange={onChange}
                                createField={createField}
                            />
                        )}
                        {field === "mathematicien" && fieldConfig.type === "select" && (
                            <FieldAdd
                                label="mathematicien"
                                onChange={onChange}
                                createField={createField}
                            />
                        )}
                    </FormControl>


                ) : fieldConfig.type === "checkbox" ? (
                    // Si c'est un champ de type "checkbox", afficher une case à cocher
                    <FormControl>
                        <FormControlLabel control={<Switch checked={Boolean(value).valueOf()}
                                                           onChange={(e) => onChange(e.target.checked)}
                                                           name="Vérification"/>} label="Vérification du concept"/>
                    </FormControl>
                ) : fieldConfig.type === "none" ? (
                    <></>
                ) : fieldConfig.type === "alias" && isAllNodeData(data) && Array.isArray(data?.aliases) && data ? (
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
                            <FieldAddAlias createField={createField} onChange={onChange} id={data.id}></FieldAddAlias>
                        </FormControl>
                    </div>
                ) : fieldConfig.type === "relation" && isAllNodeData(data) && Array.isArray(data?.relations) && data ? (
                    <div className="relation-edit-wrapper">
                        {data.relations.map((rel, index) => (
                            <RelationEdit
                                key={rel.id}
                                relation={rel}
                                onChange={(updatedRelation) => handleRelationChange(index, updatedRelation)}
                            />
                        ))}
                        <FormControl>
                            <FieldAddRelation
                                nodeName={data.nom}
                                createField={createField}
                            />
                        </FormControl>
                    </div>
                ) : fieldConfig.type === "sources" && data && isAllNodeData(data) ? (
                    <div className="source-edit-wrapper">
                        {data.sources.map((src, index) => (
                            <SourceEdit
                                key={src.id}
                                source={src}
                                onChange={(updatedSource) => handleSourceChange(index, updatedSource)}
                            />
                        ))}
                        <FormControl>
                            <FieldAddSource
                                createField={createField}
                                id={data.id}
                            />
                        </FormControl>
                    </div>
                ) : fieldConfig.type === "nom_etranger" && isAllNodeData(data) && Array.isArray(data?.noms_etrangers) && data ? (
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

                ) : fieldConfig.type === "latex" ? (
                    <LatexEditor onChange={onChange} text={value || ""}/>


                ) : fieldConfig.type === "tag" && data && isAllNodeData(data) ? (
                    <TagEdit tags={data.tags} conceptId={data.id.toString()} refetchData = {refetchData}
                    ></TagEdit>


                ): fieldConfig.type === "text" ? (
                    // Permet de ne pas avoir de balise visible sur le titre de la page
                    <TextField
                        multiline
                        fullWidth
                        minRows={4}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        label={fieldConfig.label}
                        variant="outlined"
                    />
                    ) : (
                    // Sinon, afficher un éditeur de texte comme ReactQuill
                    <ReactQuill
                        value={value || ""}
                        onChange={onChange}
                        modules={{
                            toolbar: [
                                [{'header': '1'}, {'header': '2'}, {'font': []}],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                [{'align': []}],
                                ['bold', 'italic', 'underline'],
                                ['link'],
                            ],
                        }}
                    />

                )}

                {fieldConfig.type === "tag" && data && isAllNodeData(data) ? (
                    <div className="modal-buttons">
                        <button onClick={onClose}>Sortir</button>
                    </div>

                ):(
                    <div className="modal-buttons">
                    <button onClick={onSave}>Sauvegarder</button>
            <button onClick={onClose}>Annuler</button>
                    </div>
    )}

            </div>
        </div>
    );
};
