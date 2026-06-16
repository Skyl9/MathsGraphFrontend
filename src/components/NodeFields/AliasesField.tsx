import React from "react";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface AliasesFieldProps {
  aliases: string[];
}

const AliasesField: React.FC<AliasesFieldProps> = ({ aliases }) => {
  return (
    <FieldWrapper>
      <FieldTitle>Alias :</FieldTitle>
      <FieldContent>
        {aliases.length > 0
          ? aliases.map((alias, index) => <div key={index}>{alias}</div>)
          : "Aucun alias"}
      </FieldContent>
    </FieldWrapper>
  );
};

export default AliasesField;
