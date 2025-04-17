// components/Relations/RelationEdit.tsx
import React from 'react';
import { Relations } from '../../types/types';

interface RelationEditProps {
    relation: Relations;
    onChange: (updatedRelation: Relations) => void;
}

export const RelationEdit: React.FC<RelationEditProps> = ({ relation, onChange }) => {
    return (
        <div className="relation-edit-line">
            <span className="relation-concept">{relation.concept_source.nom}</span>
            <select
                className="relation-select"
                value={relation.type_relation}
                onChange={(e) => onChange({
                    ...relation,
                    type_relation: e.target.value as Relations['type_relation']
                })}
            >
                <option value="utilise">utilise</option>
                <option value="implication">implique</option>
                <option value="equivalence">équivalent à</option>
            </select>
            <span className="relation-concept">{relation.concept_cible.nom}</span>
            <input
                className="relation-description"
                type="text"
                placeholder="Description"
                value={relation.description ?? ""}
                onChange={(e) => onChange({
                    ...relation,
                    description: e.target.value
                })}
            />
        </div>
    );
};