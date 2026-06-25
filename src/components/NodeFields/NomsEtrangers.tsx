// components/NodeFields/NomsEtrangers.tsx
import React, { useState } from "react";
import { NomEtranger } from "../../types/types";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";
import { useTranslation } from "react-i18next";

export const NomsEtrangersCollapse: React.FC<{ noms: NomEtranger[] }> = ({
  noms,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <FieldWrapper>
      <FieldTitle>{t("foreign_name.title")} :</FieldTitle>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="collapse-button"
      >
        {open ? t("common.close") : t("entities.view")}
      </button>
      {open && (
        <FieldContent>
          {noms.length > 0
            ? noms.map((n, i) => (
                <div key={i}>
                  {n.Nom_étranger} ({n.langue})
                </div>
              ))
            : t("entities.no_description")}
        </FieldContent>
      )}
    </FieldWrapper>
  );
};
