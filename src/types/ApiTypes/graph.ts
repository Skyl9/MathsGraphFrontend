export interface Graph {
    nodes: NodeData[];
    edges: any[];
};
export interface EdgeData {
    start: number;
    end: number;
    type?: string;
}



export interface NodeData {
    id: number;
    nom: string;
    position: {
        [grille: string]: { x: number; y: number; z: number };
    };
    typeMath: string;
}