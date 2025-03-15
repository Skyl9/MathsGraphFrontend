export interface NodeData {
    id: number;
    position: [number, number, number];
    nom: string;
    typeMath: string;
}

export interface EdgeData {
    start: number;
    end: number;
    type?: string;
}

export interface GraphData {
    nodes: NodeData[];
    edges: EdgeData[];
}
