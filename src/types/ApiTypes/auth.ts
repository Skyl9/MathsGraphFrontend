export interface Register{
    id:number,
    username:string,
    email:string,
    is_active:boolean,
    role:string,
    created_at:string
}

export interface accessTokens{
    access_token:string,
    token_type:string
}