import React from "react";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface SpecialFieldProps {
  title: string;
  value: string | number | boolean;
  onEdit?: () => void;
  editable?: boolean;
}

const VerifField: React.FC<SpecialFieldProps> = ({ title, value }) => {
  const renderValue = () => {
    if (typeof value === "boolean") {
      return value ? "✅" : "❌";
    }
    return value;
  };

  return (
    <FieldWrapper>
      <FieldTitle>{title} :</FieldTitle>
      <FieldContent>{renderValue()}</FieldContent>
    </FieldWrapper>
  );
};

export default VerifField;
