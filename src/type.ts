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

export interface AllNodeData {
    id: number;
    position: [number, number, number];
    nom: string;
    type: string;
    enonce : string;
    demonstration: string|null;
    mathematicien:string|null;
    categorie:string|null;
    x:number;
    y:number;
    z:number;
    verification:boolean;
}