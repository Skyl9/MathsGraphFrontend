import React from 'react';

interface SpecialFieldProps {
  title: string;
  value: string | number | boolean;
  onEdit?: () => void;
  editable?: boolean;
}

const VerifField: React.FC<SpecialFieldProps> = ({ title, value }) => {
  const renderValue = () => {
    if (typeof value === 'boolean') {
      return value ? "✅" : "❌";
    }
    return value;
  };

  return (
    <div className="node-wrapper">
      <div className="field-title">{title} :</div>
      <div className="field-content">
        {renderValue()}
      </div>
    </div>
  );
};

export default VerifField;