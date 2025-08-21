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