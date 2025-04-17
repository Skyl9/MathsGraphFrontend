import React from 'react';

interface AliasesFieldProps {
  aliases: string[];
}

const AliasesField: React.FC<AliasesFieldProps> = ({ aliases}) => {
  return (
    <div className="node-wrapper">
      <div className="field-title">Alias :</div>
      <div className="field-content">
        {aliases.length > 0
          ? aliases.map((alias, index) => (
              <div key={index}>{alias}</div>
            ))
          : "Aucun alias"}
      </div>
    </div>
  );
};

export default AliasesField;