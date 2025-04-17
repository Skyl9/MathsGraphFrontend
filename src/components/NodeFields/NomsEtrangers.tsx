// components/NodeFields/NomsEtrangers.tsx
import React, { useState } from 'react';
import { NomEtranger } from '../../types/types';

export const NomsEtrangersCollapse: React.FC<{ noms: NomEtranger[] }> = ({ noms }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="node-wrapper">
            <div className="field-title">Noms étrangers :</div>
            <button onClick={() => setOpen(prev => !prev)} className="collapse-button">
                {open ? "Masquer" : "Afficher"}
            </button>
            {open && (
                <div className="field-content">
                    {noms.length > 0
                        ? noms.map((n, i) => (
                            <div key={i}>{n.Nom_étranger} ({n.langue})</div>
                        ))
                        : "Aucun nom étranger"}
                </div>
            )}
        </div>
    );
};