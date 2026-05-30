export type Comment = {
    id: number,
    concept_id: number,
    user_id: number,
    content: string,
    parent_id: number,
    created_at: string,
    updated_at: string,
    is_deleted: boolean,
    field: string,
    username: string;
}

export interface RecentComment {
    id: number;
    concept_id: number;
    concept_nom: string;
    username: string;
    content: string;
    created_at: string;
    field: string;
}