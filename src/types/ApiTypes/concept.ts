import { Source } from "./source";
import { Relations } from "./Relations";
import { Tag } from "./tag";
import { NomEtranger } from "./nom_etranger";

export interface GetConcept {
  nom: string;
  enonce: string | null;
  demonstration: string | null;
  verification: boolean;
  type: string | null;
  id: number;
  mathematicien: { id: number; mathematicien: string } | null;
  categorie: { id: number; category: string } | null;
  sources: Source[];
  aliases: string[];
  relations: Relations[];
  noms_etrangers: NomEtranger[];
  date_modification: string | null;
  tags: Tag[];
}

export interface History {
  id: number;
  concept_id: number;
  modified_by: number;
  modified_at: string;
  field_modified: string;
  old_value: unknown;
  new_value: unknown;
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
  old_value?: unknown;
  new_value?: unknown;
}

export interface WantedConcept {
  id: number;
  nom: string;
  categorie: string | null;
  missing_fields: string[];
}
