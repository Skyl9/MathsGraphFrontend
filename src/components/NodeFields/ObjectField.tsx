import React from 'react';

interface ObjectFieldProps {
  title: string;
  object: { [key: string]: any };
  displayKey: string;
  onEdit?: () => void;
  editable?: boolean;
}

const ObjectField: React.FC<ObjectFieldProps> = ({ 
  title, 
  object, 
  displayKey, 
  onEdit, 
  editable = true 
}) => {
  return (
    <div className="node-wrapper">
      <div className="field-title">{title} :</div>
      <div className="field-content">
        {object && displayKey in object 
          ? object[displayKey]
          : `Aucun ${title.toLowerCase()}`}
      </div>
      {editable && onEdit && (
        <button className="edit-button" onClick={onEdit}>
          ✏️
        </button>
      )}
    </div>
  );
};

export default ObjectField;