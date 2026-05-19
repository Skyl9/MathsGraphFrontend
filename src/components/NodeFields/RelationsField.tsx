import React from 'react';
import { RELATION_SYMBOLS } from '../../constants/editableFields';
import {Relations} from "../../types/ApiTypes/Relations";

interface RelationsFieldProps {
  relations: Relations[];
  onEdit?: () => void;
  editable?: boolean;
}

const RelationsField: React.FC<RelationsFieldProps> = ({ relations}) => {
  const renderRelationSymbol = (type: string) => {
    return RELATION_SYMBOLS[type as keyof typeof RELATION_SYMBOLS] || type;
  };

  return (
    <div className="node-wrapper">
      <div className="field-title">Relations :</div>
      <div className="field-content">
        {relations.length > 0
          ? relations.map((relation, index) => (
              <div key={index}>
                {relation.concept_source.nom} {renderRelationSymbol(relation.type_relation)} {relation.concept_cible.nom}
                {relation.description && `, ${relation.description}`}
              </div>
            ))
          : "Aucune relation"}
      </div>

    </div>
  );
};

export default RelationsField;