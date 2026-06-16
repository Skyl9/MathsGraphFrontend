// components/NodeFields/NomsEtrangers.tsx
import React, { useState } from "react";
import { NomEtranger } from "../../types/types";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

export const NomsEtrangersCollapse: React.FC<{ noms: NomEtranger[] }> = ({
  noms,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <FieldWrapper>
      <FieldTitle>Noms étrangers :</FieldTitle>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="collapse-button"
      >
        {open ? "Masquer" : "Afficher"}
      </button>
      {open && (
        <FieldContent>
          {noms.length > 0
            ? noms.map((n, i) => (
                <div key={i}>
                  {n.Nom_étranger} ({n.langue})
                </div>
              ))
            : "Aucun nom étranger"}
        </FieldContent>
      )}
    </FieldWrapper>
  );
};
