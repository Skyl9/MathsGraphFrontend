import React from "react";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";
import { useTranslation } from "react-i18next";

interface AliasesFieldProps {
  aliases: string[];
}

const AliasesField: React.FC<AliasesFieldProps> = ({ aliases }) => {
  const { t } = useTranslation();
  return (
    <FieldWrapper>
      <FieldTitle>{t("alias.title")} :</FieldTitle>
      <FieldContent>
        {aliases.length > 0
          ? aliases.map((alias, index) => <div key={index}>{alias}</div>)
          : t("alias.placeholder")}
      </FieldContent>
    </FieldWrapper>
  );
};

export default AliasesField;
