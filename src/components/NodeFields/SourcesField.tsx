import React from "react";
import { Source } from "../../types/ApiTypes/source";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface SourcesFieldProps {
  sources: Source[];
  onEdit?: () => void;
  editable?: boolean;
}

const SourcesField: React.FC<SourcesFieldProps> = ({ sources }) => {
  return (
    <FieldWrapper>
      <FieldTitle>Sources :</FieldTitle>
      <FieldContent>
        {sources.length > 0
          ? sources.map((source, index) => (
              <div key={index}>
                {source.titre}, {source.auteur}, {source.annee}, {source.type}
              </div>
            ))
          : "Aucune source"}
      </FieldContent>
    </FieldWrapper>
  );
};

export default SourcesField;
