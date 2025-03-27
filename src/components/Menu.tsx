import React from 'react';
import {Box3, Vector3} from "three";
import {useAppContext} from "../AppContext";


export default function Menu(){
        const {
            setColor,
            setColorSides,
            setColorLemme,
            setColorAxiome,
            setColorTheoreme,
            // Positions et état de la caméra
            setInitialPosition,
            setIsPosInitial,

            // Historique
            history,
            currentIndex,

            // Navigation
            goBack,
            goForward,

            // Graphe
            exportGraph,
            importGraph,
            setFilters,
            filters} = useAppContext();

        function resetCamera() {
            const positions = history.map((pos) => new Vector3(pos.x, pos.y, pos.z)); // Positions du graphe passées à votre `Menu`
            if (positions.length > 0) {
                const bbox = new Box3().setFromPoints(positions); // Boîte englobante pour inclure tous les points visibles
                const center = new Vector3();
                bbox.getCenter(center); // Centre de tous les nœuds
                const size = bbox.getSize(new Vector3()).length(); // Taille de la scène
                const distance = size * 1.5; // Calcul d'une distance adéquate pour inclure tous les points mécaniquement

                // Mettez à jour la position initiale pour recentrer la caméra
                setInitialPosition(
                    new Vector3(center.x, center.y, center.z + distance)
                );
                setIsPosInitial(true); // Change l'état pour permettre le recentrage
            }
        }

        return (
            <div style={{position: 'absolute', top: '20px', left: '20px', padding: '10px', zIndex: '50'}}>
                <h2>Menu d'Options</h2>
                <h3>Couleur du fond : </h3>
                <button onClick={() => setColor('red')}>Rouge</button>
                <button onClick={() => setColor('green')}>Vert</button>
                <button onClick={() => setColor('blue')}>Bleu</button>

                <h3>Couleur des arrêtes : </h3>
                <button onClick={() => setColorSides('red')}>Rouge</button>
                <button onClick={() => setColorSides('green')}>Vert</button>
                <button onClick={() => setColorSides('blue')}>Bleu</button>

                <h3>Couleur des axiomes : </h3>
                <button onClick={() => setColorAxiome('red')}>Rouge</button>
                <h3>Couleur des théorèmes : </h3>
                <button onClick={() => setColorTheoreme('red')}>Rouge</button>
                <h3>Couleur des lemmes : </h3>
                <button onClick={() => setColorLemme('red')}>Rouge</button>
                {/* Bouton de réinitialisation */}
                <br/>
                <button
                    style={{
                        background: "black",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px"
                    }}
                    onClick={resetCamera}
                >
                    Réinitialiser la caméra
                </button>
                <div>
                    <button onClick={goBack} disabled={currentIndex <= 0}>⬅ Précédent</button>
                    <button onClick={goForward} disabled={currentIndex >= history.length - 1}>Suivant ➡</button>
                </div>
                <button onClick={exportGraph}>📤 Exporter le graphe</button>
                <input type="file" accept=".json" onChange={importGraph}/>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.axiome}
                            onChange={() => setFilters((prev:any) => ({...prev, axiome: !prev.axiome}))}
                        /> Axiomes
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.théorème}
                            onChange={() => setFilters((prev:any) => ({...prev, théorème: !prev.théorème}))}
                        /> Théorèmes
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.lemme}
                            onChange={() => setFilters((prev:any) => ({...prev, lemme: !prev.lemme}))}
                        /> Lemmes
                    </label>
                </div>
            </div>
        );

}