export interface Graph {
  nodes: NodeData[];
  edges: EdgeData[];
}
export interface EdgeData {
  id?: number;
  start: number;
  end: number;
  type?: string;
  type_relation?: "implication" | "equivalence" | "reciproque" | "utilise";
  description?: string;
}

export interface NodeData {
  id: number;
  nom: string;
  enonce?: string;
  position: {
    [vue: string]: { x: number; y: number; z: number };
  };
  typeMath?: string; // Optionnel : peut être null si le concept n'a pas de type associé
  domaine?: string;
}
