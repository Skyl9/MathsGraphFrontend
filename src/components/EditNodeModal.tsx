import React, { useState } from "react";
import { AllNodeData } from "../type";
import "./EditNodeModal.css";

interface EditNodeModalProps {
    nodeData: AllNodeData;
    onClose: () => void;
    onSave: () => void;
}

const EditNodeModal: React.FC<EditNodeModalProps> = ({ nodeData, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<AllNodeData>>({
        nom: nodeData.nom,
        type: nodeData.type,
        enonce: nodeData.enonce,
        demonstration: nodeData.demonstration,
        mathematicien: nodeData.mathematicien,
        categorie: nodeData.categorie,
    });

    // 📌 Gestion des changements dans le formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 📌 Envoi des modifications au serveur
    const handleSave = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_LINK + `/updateNodes/${nodeData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.log(`Erreur serveur: ${response.status}`);
            }

            onSave(); // Recharge les données après modification
            onClose(); // Ferme la fenêtre modale
        } catch (err) {
            console.error("Erreur lors de l'enregistrement :", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Modifier le nœud</h2>

                <label>Nom :</label>
                <input type="text" name="nom" value={formData.nom || ""} onChange={handleChange} />

                <label>Type :</label>
                <input type="text" name="type" value={formData.type || ""} onChange={handleChange} />

                <label>Enoncé :</label>
                <textarea name="enonce" value={formData.enonce || ""} onChange={handleChange} />

                <label>Démonstration :</label>
                <textarea name="demonstration" value={formData.demonstration || ""} onChange={handleChange} />

                <label>Mathématicien :</label>
                <input type="text" name="mathematicien" value={formData.mathematicien || ""} onChange={handleChange} />

                <label>Catégorie :</label>
                <input type="text" name="categorie" value={formData.categorie || ""} onChange={handleChange} />

                <div className="modal-buttons">
                    <button onClick={handleSave}>Sauvegarder</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default EditNodeModal;
