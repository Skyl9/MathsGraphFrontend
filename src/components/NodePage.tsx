import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../AppContext";
import { AllNodeData } from "../type";
import EditNodeModal from "./EditNodeModal"; // Import du modal
import "./EditNodeModal.css";


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
        try {
            const response = await fetch(`http://127.0.0.1:8000/getNode/${id}`);
            if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);
            const fetchedData: AllNodeData = await response.json();
            setData(fetchedData);
        } catch (err) {
            console.error(err);
            setError(`Erreur : ${err instanceof Error ? err.message : "Erreur inconnue"}`);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (!node) return <p>Nœud introuvable.</p>;
    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>{data?.nom}</h1>
            <p>Type : {data?.type}</p>
            <p>Enoncé : {data?.enonce}</p>
            <p>Démonstration : {data?.demonstration}</p>
            <p>Mathématicien : {data?.mathematicien}</p>
            <p>Catégorie : {data?.categorie}</p>
            <p>Id : {data?.id}</p>

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

            {/* 📌 Bouton pour ouvrir la fenêtre de modification */}
            <button onClick={() => setIsModalOpen(true)}>Modifier</button>
            <button onClick={() => window.history.back()}>Retour</button>

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
