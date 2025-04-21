import React from 'react';
import { NomEtranger } from '../../types/types';

interface NomEtrangerEditProps {
  nomEtranger: NomEtranger;
  index: number;
  onChange: (index: number, updatedNom: NomEtranger) => void;
}

const NomEtrangerEdit: React.FC<NomEtrangerEditProps> = ({ nomEtranger, index, onChange }) => {
  return (
    <div className="nom-etranger-edit-line">
      <input
        className="nom-etranger-input"
        type="text"
        placeholder="Nom étranger"
        value={nomEtranger.Nom_étranger || ""}
        onChange={(e) => onChange(index, { ...nomEtranger, Nom_étranger: e.target.value })}
      />
      <input
        className="langue-input"
        type="text"
        placeholder="Langue"
        value={nomEtranger.langue || ""}
        onChange={(e) => onChange(index, { ...nomEtranger, langue: e.target.value })}
      />
    </div>
  );
};

export default NomEtrangerEdit;