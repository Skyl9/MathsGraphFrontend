import {useCallback, useState} from 'react';
import {Box3, Vector3} from "three";
import {
    Drawer,
    IconButton,
    Typography,
    Box,
    Button,
    FormControlLabel,
    Checkbox,
    Divider, Switch,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from "./SearchBar";
import "../styles/Menu.css";
import {Graph, NodeData} from "../types/ApiTypes/graph";
import {AutoGraph, GridOn} from "@mui/icons-material"; // Importer Graph
import {useUIStore} from "../stores/useUIStore";
import {useFilterStore} from "../stores/useFilterStore";
import {useGraphStore} from "../stores/useGraphStore";

interface MenuProps {
    graphData: Graph; // Ajouter graphData aux props
}

export default function Menu( { graphData }: MenuProps){ // Accepter graphData comme prop
    const darkMode = useUIStore(s => s.darkMode);
    const setDarkMode = useUIStore(s => s.setDarkMode);
    const currentView = useUIStore(s => s.currentView);
    const setCurrentView = useUIStore(s => s.setCurrentView);
    const graphTheme = useUIStore(s => s.graphTheme);
    const setGraphTheme = useUIStore(s => s.setGraphTheme);

    const filters = useFilterStore(s => s.filters);
    const setFilters = useFilterStore(s => s.setFilters);

    const setInitialPosition = useGraphStore(s => s.setInitialPosition);
    const setIsPosInitial = useGraphStore(s => s.setIsPosInitial);
    const setSelectedNodeId = useGraphStore(s => s.setSelectedNodeId);
    const setTargetPosition = useGraphStore(s => s.setTargetPosition);
    const history = useGraphStore(s => s.history);
    const currentIndex = useGraphStore(s => s.currentIndex);
    const goBack = useGraphStore(s => s.goBack);
    const goForward = useGraphStore(s => s.goForward);

    function resetCamera() {
        // Vérifier que graphData et ses noeuds existent
        if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
            console.warn("Pas de données de graphe pour réinitialiser la caméra.");
            return;
        }

        const positions = graphData.nodes.map((node) => new Vector3(
            node.position[currentView].x,
            node.position[currentView].y,
            node.position[currentView].z
        ));

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
    const [isSearch, setIsSearch] = useState(false);
    const toggleDrawer = (newOpen:boolean) => () => {
        setOpen(newOpen);
    }
    const [searchResults, setSearchResults] = useState<NodeData[]>([]); // Typage précis

    const handleSearch = useCallback((query: string) => {
        if (!query || typeof query !== 'string') {
            setSearchResults([]);
            return;
        }

        if (graphData) {
            const results = graphData.nodes.filter((node) =>
                node.nom.toLowerCase().includes(query.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [graphData]);

    function handleResultsSearch (node:NodeData) {
        if (node){
            const {x,y,z} = node.position[currentView]
            console.log(x,y,z)
            setTargetPosition(new Vector3(x,y,z));
            setSelectedNodeId(node.id);
        }

    }


    return (
        <div className={darkMode ? 'dark-mode' : ''}>
            <div className="menu-container">
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
                        <Typography variant="h6" sx={{ mb: 1 }}>Mode d'affichage :</Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                            <InputLabel>Vue actuelle</InputLabel>
                            <Select
                                value={currentView}
                                label="Vue actuelle"
                                onChange={(e) => setCurrentView(e.target.value)}
                            >
                                <MenuItem value="grille"><GridOn sx={{ mr: 1, fontSize: 20 }}/> Grille 3D</MenuItem>
                                <MenuItem value="physique"><AutoGraph sx={{ mr: 1, fontSize: 20 }}/> Physique Organique</MenuItem>
                                {/* MenuItem value="arbre">Arbre Hiérarchique</MenuItem */}
                            </Select>
                        </FormControl>
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/>
                            </svg>
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
                        <Divider sx={{ my: 2 }} />
                        <FormControlLabel
                            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                            label="Mode sombre"
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Style Visuel :
                    </Typography>
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="theme-select-label">Thème 3D</InputLabel>
                        <Select
                            labelId="theme-select-label"
                            value={graphTheme}
                            label="Thème 3D"
                            onChange={(e) => setGraphTheme(e.target.value as "classique" | "neon" | "focus")}
                        >
                            <MenuItem value="classique">Classique (Fluide)</MenuItem>
                            <MenuItem value="neon">Néon (Lumineux)</MenuItem>
                            <MenuItem value="focus">Focus (Isolation)</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{ my: 2 }} />
                    <FormControlLabel
                        control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                        label="Mode sombre UI"
                    />
                </Drawer>
            </div>
            <div className="search-bar-container">
                <SearchBar onSearch={handleSearch} setIsSearch={setIsSearch} />
                {searchResults.length > 0 && isSearch && (
                    <div className="search-results">
                        {searchResults.map((result) => (
                            <div key={result.id} className="search-result-item" onClick={() => handleResultsSearch(result)}>
                                {result.nom} ({result.typeMath})
                            </div>
                        ))}
                    </div>
                )}
                {searchResults.length === 0 && isSearch && (
                    <div className="search-results">
                        Pas de démonstration trouvé
                    </div>
                )}
            </div>
        </div>
    );
}