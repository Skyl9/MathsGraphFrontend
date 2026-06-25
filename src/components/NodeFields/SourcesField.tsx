import React from "react";
import { Source } from "../../types/ApiTypes/source";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";
import { useTranslation } from "react-i18next";

interface SourcesFieldProps {
  sources: Source[];
  onEdit?: () => void;
  editable?: boolean;
}

const SourcesField: React.FC<SourcesFieldProps> = ({ sources }) => {
  const { t } = useTranslation();
  return (
    <FieldWrapper>
      <FieldTitle>{t("source.title")} :</FieldTitle>
      <FieldContent>
        {sources.length > 0
          ? sources.map((source, index) => (
              <div key={index}>
                {source.titre}, {source.auteur}, {source.annee}, {source.type}
              </div>
            ))
          : t("entities.no_description")}
      </FieldContent>
    </FieldWrapper>
  );
};

export default SourcesField;
