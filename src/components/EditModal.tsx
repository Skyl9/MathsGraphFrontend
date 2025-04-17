// components/EditModal.tsx
import React from 'react';
import {AllNodeData, EditableField, ModalProps, NomEtranger, Relations, Source} from "../types/types";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
import { RelationEdit } from './Relations/RelationEdit';
import SourceEdit from './NodeFields/SourceEdit';
import AliasEdit from './NodeFields/AliasEdit';
import NomEtrangerEdit from './NodeFields/NomEtrangerEdit';


export const EditModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSave,
    field,
    value,
    onChange,
    fieldConfig,
    data
}) => {
    // Pour les relations
    const handleRelationChange = (index: number, updatedRelation: Relations) => {
        if (data) {
            const updated = [...data.relations];
            updated[index] = updatedRelation;
            onChange({ ...data, relations: updated });
        }
    };

    // Pour les sources
    const handleSourceChange = (index: number, updatedSource: Source) => {
        if (data) {
            const updated = [...data.sources];
            updated[index] = updatedSource;
            onChange({ ...data, sources: updated });
        }
    };

    // Pour les alias
    const handleAliasChange = (index: number, value: string) => {
        if (data) {
            const updated = [...data.aliases];
            updated[index] = value;
            onChange({ ...data, aliases: updated });
        }
    };

    // Pour les noms étrangers
    const handleNomEtrangerChange = (index: number, updatedNom: NomEtranger) => {
        if (data && data.noms_etrangers) {
            const updated = [...data.noms_etrangers];
            updated[index] = updatedNom;
            onChange({ ...data, noms_etrangers: updated });
        }
    };
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Modifier {fieldConfig.label}</h2>
                {fieldConfig.type === "select" ? (
                    <select
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                    >
                        {fieldConfig.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : fieldConfig.type === "checkbox" ? (
                    // Si c'est un champ de type "checkbox", afficher une case à cocher
                    <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(e) => onChange(e.target.checked ? "true" : "false")}
                    />
                ) : fieldConfig.type === "none" ? (
                    <></>
                ) : fieldConfig.type === "alias" && Array.isArray(data?.aliases) && data ? (
                    <div className="alias-edit-wrapper">
                        {data.aliases.map((alias, index) => (
                            <AliasEdit 
                                key={index} 
                                alias={alias} 
                                index={index} 
                                onChange={handleAliasChange} 
                            />
                        ))}
                    </div>
                ) : fieldConfig.type === "relation" && Array.isArray(data?.relations) && data ? (
                    <div className="relation-edit-wrapper">
                        {data.relations.map((rel, index) => (
                            <RelationEdit 
                                key={rel.id} 
                                relation={rel} 
                                onChange={(updatedRelation) => handleRelationChange(index, updatedRelation)} 
                            />
                        ))}
                    </div>
                ) : fieldConfig.type === "sources" && data ? (
                    <div className="source-edit-wrapper">
                        {data.sources.map((src, index) => (
                            <SourceEdit 
                                key={src.id} 
                                source={src} 
                                onChange={(updatedSource) => handleSourceChange(index, updatedSource)} 
                            />
                        ))}
                    </div>
                ) : fieldConfig.type === "nom_etranger" && Array.isArray(data?.noms_etrangers) && data ? (
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
                ) : (
                    // Sinon, afficher un éditeur de texte comme ReactQuill
                    <ReactQuill
                        value={value || ""}
                        onChange={onChange}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'align': [] }],
                                ['bold', 'italic', 'underline'],
                                ['link'],
                            ],
                        }}
                    />
                )}


                <div className="modal-buttons">
                    <button onClick={onSave}>Sauvegarder</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};
