export interface User {
    id:number;
    username:string;
    email:string;
    role:string;
    created_at:string;
    updated_at:string;
    is_active:boolean;
    preferred_language:string;
    avatar_url:string;
    bio:string;
}
export interface Favorite {
    id:number;
    nom:string;
    category:string;
}