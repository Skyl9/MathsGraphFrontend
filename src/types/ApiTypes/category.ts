export interface CategoryName {
  id: number;
  nom: string;
}
export interface Category {
  id: number;
  nom: string;
  description: string | null;
  parent_id: number | null;
}
