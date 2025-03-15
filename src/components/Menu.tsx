import React from 'react';
import {Vector3} from "three";

class Menu extends React.Component<{ setColor: any,  setColorSides:any, setColorLemme:any, setColorAxiome:any,setColorTheoreme:any,
    setTargetPosition:any,
    initialPosition:any,
    setInitialPosition:any,
    setIsPosInitial:any
    moveToPosition:any,
    goBack:any,
    goForward:any,
    history:Vector3[],
    currentIndex:number,
    exportGraph:any,
    importGraph:any,
    filters:any,
    setFilters:any,

}> {
    render() {
        let {setColor} = this.props;
        let {setColorSides} = this.props;
        let {setColorLemme} = this.props;
        let {setColorAxiome} = this.props;
        let {setColorTheoreme} = this.props;
        let {initialPosition} = this.props;
        let {setIsPosInitial} = this.props;
        let {goBack} = this.props;
        let {goForward} = this.props;
        let {history} = this.props;
        let {currentIndex} = this.props;
        let {exportGraph}= this.props;
        let {importGraph} = this.props;
        let {filters} = this.props;
        let {setFilters}= this.props;



        function resetCamera() {
            if (initialPosition) {
                setIsPosInitial(true)
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
                            checked={filters.theoreme}
                            onChange={() => setFilters((prev:any) => ({...prev, theoreme: !prev.theoreme}))}
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
}

export default Menu;
