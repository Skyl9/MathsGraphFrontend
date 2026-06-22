import React from "react";
import { NomEtranger } from "../../types/types";
import { useTranslation } from "react-i18next";

interface NomEtrangerEditProps {
  nomEtranger: NomEtranger;
  index: number;
  onChange: (index: number, updatedNom: NomEtranger) => void;
}

const NomEtrangerEdit: React.FC<NomEtrangerEditProps> = ({
  nomEtranger,
  index,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="nom-etranger-edit-line">
      <input
        className="nom-etranger-input"
        type="text"
        placeholder={t("foreign_name.fields.name")}
        value={nomEtranger.Nom_étranger || ""}
        onChange={(e) =>
          onChange(index, { ...nomEtranger, Nom_étranger: e.target.value })
        }
      />
      <input
        className="langue-input"
        type="text"
        placeholder={t("foreign_name.fields.language")}
        value={nomEtranger.langue || ""}
        onChange={(e) =>
          onChange(index, { ...nomEtranger, langue: e.target.value })
        }
      />
    </div>
  );
};

export default NomEtrangerEdit;
