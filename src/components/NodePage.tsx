import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { AllNodeData } from "../type";
import EditNodeModal from "./EditNodeModal"; // Import du modal
import "./NodePage.css";


const NodePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { graphData } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AllNodeData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // 📌 État pour afficher/cacher le modal

    const node = graphData?.nodes.find(n => n.id === Number(id));


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const backendLink = process.env.REACT_APP_BACKEND_LINK||"";

        if (!backendLink) {
            setError("Lien du backend non défini");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(backendLink + "/getNode/"+id);
            if (!response.ok) {
                setError(`Erreur serveur: ${response.status}`);
                return;
            }

            const fetchedData: AllNodeData = await response.json();
            setData(fetchedData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err);
                setError(`Erreur : ${err.message}`);
            } else {
                console.error("Erreur inconnue", err);
                setError("Erreur inconnue");
            }
        } finally {
            setLoading(false);
        }
    }, [id]);


    useEffect(() => {
        fetchData().catch((err) => console.error("Erreur dans useEffect:", err));
    }, [fetchData]);



    if (!node) return <p>Nœud introuvable.</p>;
    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="node-container">
            <h1 className="node-title">{data?.nom}</h1>

            <div className="node-info">
                <p><strong>Type :</strong> {data?.type}</p>
                <p><strong>Énoncé :</strong> {data?.enonce}</p>
                <p><strong>Démonstration :</strong> {data?.demonstration}</p>
                <p><strong>Mathématicien :</strong> {data?.mathematicien}</p>
                <p><strong>Catégorie :</strong> {data?.categorie}</p>
                <p><strong>ID :</strong> {data?.id}</p>
            </div>

            <div className="node-relations">
                <h2>Relations :</h2>
                <ul>
                    {graphData && graphData.edges
                        .filter(edge => edge.start === node.id || edge.end === node.id)
                        .map((edge, index) => (
                            <li key={index}>
                                Lien avec le nœud {edge.start === node.id ? edge.end : edge.start}
                            </li>
                        ))}
                </ul>
            </div>

            <div className="node-buttons">
                {/* 📌 Bouton pour ouvrir la fenêtre de modification */}
                <button className="edit-button" onClick={() => setIsModalOpen(true)}>Modifier</button>
                <button className="back-button" onClick={() => window.history.back()}>Retour</button>
            </div>

            {/* 📌 Affichage du modal */}
            {isModalOpen && data && (
                <EditNodeModal
                    nodeData={data}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchData} // Recharge les données après modification
                />
            )}
        </div>
    );
};

export default NodePage;
