// src/services/api.ts
import {
    AllNodeData,
    RollbackConcept
} from "../types/types";
import Token from "./token";
import {ConceptName, GetConcept, History} from "../types/ApiTypes/concept";
import {accessTokens, Register} from '../types/ApiTypes/auth'
import {Mathematicien, MathematicienName} from "../types/ApiTypes/mathematicien";
import {Category, CategoryName} from "../types/ApiTypes/category";
import {Type} from "../types/ApiTypes/type";
import {Favorite, User} from "../types/ApiTypes/user";
import {Tag} from "../types/ApiTypes/tag";
import {Comment} from "../types/ApiTypes/comments";
import {AdminStats, ContentAdmin} from "../types/ApiTypes/admin";

const BASE_URL = process.env.REACT_APP_BACKEND_LINK || '';

// Define a unified error structure
interface ApiError {
    status: number;
    code?: string;
    message: string;
}

// Define the shape of a successful API response
interface ApiResponse<T> {
    data: T;
    error: string | null;
    success: boolean;
    meta: string | null;
}

export type EditableFieldsOptions = Record<keyof AllNodeData, string[]>;

// Define a custom, centralized request function
const request = async <T>(
    endpoint: string,
    options?: RequestInit,
    authRequired: boolean = true
): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    const headers = new Headers(options?.headers);
    headers.set('Content-Type', 'application/json');

    if (authRequired) {
        const token = Token.getToken();
        if (!token) {
            throw {status: 401, message: "Authentification requise: Token non trouvé."} as ApiError;
        }
        headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
        ...options,
        headers,
        signal: controller.signal,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        clearTimeout(timeoutId);

        const data: ApiResponse<T> = await response.json();

        if (!response.ok || !data.success) {
            const error: ApiError = {
                status: response.status,
                message: data.error || `Erreur serveur: ${response.status}`,
                code: data.meta || undefined,
            };
            if (response.status === 401) {
                // Here, you would trigger a token refresh flow
                // For now, simply throw the error
                // await Token.refreshToken();
                // and then retry the request.
            }
            throw error;
        }

        return data.data;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.name === 'AbortError') {
            // eslint-disable-next-line no-throw-literal
            throw {status: 408, message: 'La requête a expiré.'} as ApiError;
        }
        throw error;
    }
};
// TODO Rajouter l'appel api /graph (rapatrier le code depuis la page du graph)

export const nodeApi = {
    // GET requests
    getConcept: (id: string) => request<GetConcept>(`/concept/${id}`, undefined, false),
    getComments: (concept_id: string) => request<Comment[]>(`/comments/${concept_id}`, undefined, false),
    getAllUsers: () => request<User[]>(`/admin/users`),
    getAllContents: () => request<ContentAdmin[]>(`/admin/contents`),
    getAdminStats: () => request<AdminStats>(`/admin/stats`),
    getFavorites: (user_id?: string) => request<Favorite[]>(`/user/favorite/${user_id || Token.getUserIdFromToken() || ""}`, undefined, false),
    getCategoryId: (name: string) => request<CategoryName>(`/category/name/${name}`, undefined, false),
    getMathematicienId: (name: string) => request<Mathematicien>(`/mathematicien/name/${name}`, undefined, false),
    getTypeId: (name: string) => request<Type>(`/type/name/${name}`, undefined, false),
    getConceptHistory: (conceptId: string) => request<History[]>(`/concept/history/${conceptId}`, undefined, false),
    getEditableFieldsOptions: () => request<EditableFieldsOptions>(`/getEditableFieldsOptions`, undefined, false),
    getOneMathematicien: (id: string) => request<Mathematicien>(`/mathematicien/${id}`, undefined, false),
    getOneType: (id: string) => request<Type>(`/type/${id}`, undefined, false),
    getOneCategory: (id: string) => request<Category>(`/category/${id}`, undefined, false),
    getAllCategories: () => request<Category[]>(`/category/`, undefined, false),
    getAllMathematicienName: () => request<MathematicienName[]>(`/mathematicien/`, undefined, false),
    getAllTypeNames: () => request<Type[]>(`/type/`, undefined, false),
    getAllConceptNames: () => request<ConceptName[]>(`/getAllConceptName`, undefined, false),
    getUserInfo: (id: string) => request<User>(`/user/${id}`, undefined, false),
    getUserIdByUsername: (username: string) => request<{ id: number }>(`/user/id/${username}`, undefined, false),
    getTagsNameFromConceptId: (id: string) => request<Tag[]>(`/tags/name/concept_id/${id}`, undefined, false),
    getAllTagName: () => request<Tag[]>(`/tags/all`, undefined, false),

    // POST/PATCH/DELETE requests
    updateConcept: (id: string, field: string, value: any, username: string) =>
        request<null>(`/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({field, value, username}),
        }),
    postComment: (concept_id: string, parent_id: number, field: string, comment: string) =>
        request<null>(`/comments/add/${concept_id}`, {
            method: 'POST',
            body: JSON.stringify({field, parent_id, content: comment, username: Token.getUsernameFromToken() || ""}),
        }),
    deleteComment: (comment_id: string) => request<null>(`/comments/delete/${comment_id}`, {method: 'DELETE'}),
    updateComment: (concept_id: string, content: string) =>
        request<null>(`/comments/update/${concept_id}`, {
            method: 'PATCH',
            body: JSON.stringify({content}),
        }),
    addFavorite: (general_id: string, type: string) =>
        request<null>(`/user/favorite/add/${general_id}`, {
            method: 'POST',
            body: JSON.stringify({type, user_id: String(Token.getUserIdFromToken()) || ""}),
        }),
    deleteFavorite: (general_id: string, type: string) =>
        request<null>(`/user/favorite/delete/${general_id}`, {
            method: 'DELETE',
            body: JSON.stringify({type, user_id: String(Token.getUserIdFromToken()) || ""}),
        }),
    rollbackConcept: (id: string, data: RollbackConcept) =>
        request<null>(`/concept/rollback/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                version_number: data.version_number,
                field_modified: data.field_modified,
                username: data.username
            }),
        }),
    createRelation: (dico: {}) =>
        request<null>(`/relation/create`, {
            method: 'POST',
            body: JSON.stringify({value: dico}),
        }),
    createCategory: (nom: string) => request<null>(`/category/create`, {
        method: 'POST',
        body: JSON.stringify({value: nom})
    }),
    createType: (nom: string) => request<null>(`/type/create`, {method: 'POST', body: JSON.stringify({value: nom})}),
    createMathematicien: (nom: string) => request<null>(`/mathematicien/create`, {
        method: 'POST',
        body: JSON.stringify({value: nom})
    }),
    createAlias: (id: number, nom: string) => request<null>(`/alias/create`, {
        method: 'POST',
        body: JSON.stringify({id, value: nom})
    }),
    createSources: (sources: any) => request<null>(`/source/create`, {
        method: 'POST',
        body: JSON.stringify({value: sources})
    }),
    updateOneMathematicien: (id: string, field: string, value: any) =>
        request<null>(`/mathematicien/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    updateOneCategory: (id: string, field: string, value: any) =>
        request<null>(`/category/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    updateOneType: (id: string, field: string, value: any) =>
        request<null>(`/type/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    requestPasswordReset: (email: string) =>
        request<null>(`/password-reset/request`, {method: 'POST', body: JSON.stringify({email})}, false),
    resetPassword: (token: string, password: string) =>
        request<null>(`/password-reset/confirm`, {
            method: 'POST',
            body: JSON.stringify({token, new_password: password})
        }, false),
    removeTagsFromConceptId: (concept_id: number, tags_id: number) =>
        request<null>(`/tags/remove/concept`, {method: 'POST', body: JSON.stringify({concept_id, tag_id: tags_id})}),
    createTags: (tags: string) => request<null>(`/tags/add`, {method: 'POST', body: JSON.stringify({tag_name: tags})}),
    createLinkTagConcept: (concept_id: number, tags_id: number) =>
        request<null>(`/tags/add/concept`, {method: 'POST', body: JSON.stringify({concept_id, tag_id: tags_id})}),
    patchUser: (data: { field: string, value: string }, id: string) =>
        request<null>(`/user/update/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    getToken: (formData: URLSearchParams) =>
        request<accessTokens>(`/token`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData.toString(),
        }, false),
    register: (username: string, email: string, password: string) =>
        request<Register>(`/register`, {method: "POST", body: JSON.stringify({username, email, password})}, false),
};

// No longer needed after centralization
// export const handleError = ...