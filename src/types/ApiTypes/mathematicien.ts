export interface Mathematicien {
  id: number;
  nom: string;
  date_naissance: string | null;
  date_deces: string | null;
  biographie: string | null;
  nationalite: string | null;
  domaines: string[];
  url: string | null;
  recompense: string | null;
  epoque: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface MathematicienName {
  id: number;
  nom: string;
}
