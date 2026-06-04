import { Source } from "./source";
import { Alias } from "./alias";
import { Relations } from "./Relations";
import { Tag } from "./tag";

export interface GetConcept {
  nom: string;
  enonce: string;
  demonstration: string;
  verification: boolean;
  type: string;
  id: number;
  mathematicien: { id: number; mathematicien: string };
  categorie: { id: number; category: string };
  sources: Source[];
  aliases: Alias[];
  relations: Relations[];
  noms_etrangers: Record<string, unknown>[];
  date_modification: string;
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
