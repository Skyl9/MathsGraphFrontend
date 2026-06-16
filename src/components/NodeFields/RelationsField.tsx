import React from "react";
import { RELATION_SYMBOLS } from "../../constants/editableFields";
import { Relations } from "../../types/ApiTypes/Relations";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface RelationsFieldProps {
  relations: Relations[];
  onEdit?: () => void;
  editable?: boolean;
}

const RelationsField: React.FC<RelationsFieldProps> = ({ relations }) => {
  const renderRelationSymbol = (type: string) => {
    return RELATION_SYMBOLS[type as keyof typeof RELATION_SYMBOLS] || type;
  };

  return (
    <FieldWrapper>
      <FieldTitle>Relations :</FieldTitle>
      <FieldContent>
        {relations.length > 0
          ? relations.map((relation, index) => (
              <div key={index}>
                {relation.concept_source.nom}{" "}
                {renderRelationSymbol(relation.type_relation)}{" "}
                {relation.concept_cible.nom}
                {relation.description && `, ${relation.description}`}
              </div>
            ))
          : "Aucune relation"}
      </FieldContent>
    </FieldWrapper>
  );
};

export default RelationsField;
