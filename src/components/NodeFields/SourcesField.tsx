import React from 'react';
import {Source} from '../../types/ApiTypes/source';
interface SourcesFieldProps {
  sources: Source[];
  onEdit?: () => void;
  editable?: boolean;
}

const SourcesField: React.FC<SourcesFieldProps> = ({ sources, onEdit, editable = true }) => {
  return (
    <div className="node-wrapper">
      <div className="field-title">Sources :</div>
      <div className="field-content">
        {sources.length > 0
          ? sources.map((source, index) => (
              <div key={index}>
                {source.titre}, {source.auteur}, {source.annee}, {source.type}
              </div>
            ))
          : "Aucune source"}
      </div>
    </div>
  );
};

export default SourcesField;