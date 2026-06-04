export interface GetConcept {
  nom: string;
  enonce: string;
  demonstration: string;
  verification: boolean;
  type: string;
  id: number;
  mathematicien: { id: number; mathematicien: string };
  categorie: { id: number; category: string };
  sources: Array<any>;
  aliases: Array<any>;
  relations: Array<any>;
  noms_etrangers: Array<any>;
  date_modification: string;
  tags: Array<any>;
}

export interface History {
  id: number;
  concept_id: number;
  modified_by: number;
  modified_at: string;
  field_modified: string;
  old_value: any;
  new_value: any;
  version_number: number;
  global_version: number;
  is_rollback: boolean;
  note: string;
}
export interface ConceptName {
  nom: string;
  id: number;
}

export interface RecentChange {
  id: number;
  concept_id: number;
  concept_nom: string;
  username: string;
  modified_at: string;
  field_modified: string;
  is_rollback: boolean;
  old_value?: any;
  new_value?: any;
}
