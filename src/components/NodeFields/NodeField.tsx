import React from "react";
import DOMPurify from "dompurify";
import { AllNodeData } from "../../types/types";

interface NodeFieldProps {
  field: keyof AllNodeData;
  data: AllNodeData | null;
  onEdit?: () => void;
  editable?: boolean;
}

const NodeField: React.FC<NodeFieldProps> = ({
  field,
  data,
  onEdit,
  editable = true,
}) => {
  if (!data) return null;

  const value = data[field];

  return (
    <div className="node-wrapper">
      <div className="field-title">
        {field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")} :
      </div>
      <div
        className="field-content"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(String(value ?? "Aucune donnée")),
        }}
      />
      {editable && onEdit && (
        <button
          className="edit-button"
          onClick={onEdit}
          aria-label={`Éditer le champ ${field}`}
        >
          ✏️
        </button>
      )}
    </div>
  );
};

export default NodeField;
