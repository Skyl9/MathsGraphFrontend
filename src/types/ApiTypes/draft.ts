export interface Draft {
  id: number;
  user_id: string;
  concept_id: number | null;
  draft_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DraftCreate {
  concept_id: number | null;
  draft_data: Record<string, any>;
}

export interface DraftUpdate {
  draft_data: Record<string, any>;
}
