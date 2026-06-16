import React from "react";
import { Link } from "react-router-dom";
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
                <Link
                  to={`/concept/${relation.concept_source.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  {relation.concept_source.nom}
                </Link>{" "}
                {renderRelationSymbol(relation.type_relation)}{" "}
                <Link
                  to={`/concept/${relation.concept_cible.id}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  {relation.concept_cible.nom}
                </Link>
                {relation.description && `, ${relation.description}`}
              </div>
            ))
          : "Aucune relation"}
      </FieldContent>
    </FieldWrapper>
  );
};

export default RelationsField;
