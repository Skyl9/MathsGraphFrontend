import React, {useState} from 'react';
import {Box3, Vector3} from "three";
import {
    Drawer,
    IconButton,
    Typography,
    Box,
    Button,
    FormControlLabel,
    Checkbox,
    Divider,
} from '@mui/material';
import {useAppContext} from "../AppContext";
import MenuIcon from '@mui/icons-material/Menu';


export default function Menu(){
        const {
            // Positions et état de la caméra
            setInitialPosition,
            setIsPosInitial,
            graphData,

            // Historique
            history,
            currentIndex,

            // Navigation
            goBack,
            goForward,

            // Graphe
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
        const exportGraph = () => {
        const dataStr = JSON.stringify(graphData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "graphData.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
        const [open, setOpen] = useState(false);

        const toggleDrawer = (newOpen:boolean) => () => {
            setOpen(newOpen);
        }


    return (
        <div style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px', zIndex: '50' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
                <Box sx={{ width: 250, p: 2 }} role="presentation">
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Menu d'Options
                    </Typography>

                    <Button variant="outlined" onClick={resetCamera} sx={{ mb: 1 }}>
                        Réinitialiser la caméra
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Navigation
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Button variant="outlined" onClick={goBack} disabled={currentIndex <= 0}>
                            ⬅ Précédent
                        </Button>
                        <Button variant="outlined" onClick={goForward} disabled={currentIndex >= history.length - 1}>
                            ➡ Suivant
                        </Button>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Téléchargement du fichier JSON :
                    </Typography>
                    <Button variant="outlined" onClick={exportGraph} sx={{ mb: 1 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
                        Télécharger le graphe
                    </Button>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Filtre :
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters.axiome}
                                    onChange={() => setFilters((prev: any) => ({ ...prev, axiome: !prev.axiome }))}
                                />
                            }
                            label="Axiomes"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters.théorème}
                                    onChange={() => setFilters((prev: any) => ({ ...prev, théorème: !prev.théorème }))}
                                />
                            }
                            label="Théorèmes"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filters.lemme}
                                    onChange={() => setFilters((prev: any) => ({ ...prev, lemme: !prev.lemme }))}
                                />
                            }
                            label="Lemmes"
                        />
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}