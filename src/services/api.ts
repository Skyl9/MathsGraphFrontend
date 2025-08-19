// src/services/api.ts
import {AllNodeData, CategoryInfo, MathematicienInfo, RollbackConcept, TypeInfo} from "../types/types";
import Token from "./token";

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

export const nodeApi = {
    // GET requests
    getConcept: (id: string) => request<any>(`/concept/${id}`, undefined, false),
    getComments: (concept_id: string) => request<any[]>(`/comments/${concept_id}`, undefined, false),
    getAllUsers: () => request<any[]>(`/admin/users`),
    getAllContents: () => request<any[]>(`/admin/contents`),
    getAdminStats: () => request<any>(`/admin/stats`),
    getFavorites: (user_id?: string) => request<any[]>(`/user/favorite/${user_id || Token.getUserIdFromToken() || ""}`, undefined, false),
    getCategoryId: (name: string) => request<CategoryInfo>(`/category/name/${name}`, undefined, false),
    getMathematicienId: (name: string) => request<MathematicienInfo>(`/mathematicien/name/${name}`, undefined, false),
    getTypeId: (name: string) => request<TypeInfo>(`/type/name/${name}`, undefined, false),
    getConceptHistory: (conceptId: string) => request<any[]>(`/concept/history/${conceptId}`, undefined, false),
    getEditableFieldsOptions: () => request<EditableFieldsOptions>(`/getEditableFieldsOptions`, undefined, false),
    getOneMathematicien: (id: string) => request<any>(`/mathematicien/${id}`, undefined, false),
    getOneType: (id: string) => request<any>(`/type/${id}`, undefined, false),
    getOneCategory: (id: string) => request<any>(`/category/${id}`, undefined, false),
    getAllCategories: () => request<any[]>(`/category/`, undefined, false),
    getAllMathematicienName: () => request<any[]>(`/mathematicien/`, undefined, false),
    getAllTypeNames: () => request<any[]>(`/type/`, undefined, false),
    getAllConceptNames: () => request<any[]>(`/getAllConceptName`, undefined, false),
    getUserInfo: (id: string) => request<any>(`/user/${id}`, undefined, false),
    getUserIdByUsername: (username: string) => request<{ id: number }>(`/user/id/${username}`, undefined, false),
    getTagsNameFromConceptId: (id: string) => request<any[]>(`/tags/name/concept_id/${id}`, undefined, false),
    getAllTagName: () => request<any[]>(`/tags/all`, undefined, false),

    // POST/PATCH/DELETE requests
    updateNode: (id: string, field: string, value: any, username: string) =>
        request<any>(`/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({field, value, username}),
        }),
    postComment: (concept_id: string, parent_id: number, field: string, comment: string) =>
        request<any>(`/comments/add/${concept_id}`, {
            method: 'POST',
            body: JSON.stringify({field, parent_id, content: comment, username: Token.getUsernameFromToken() || ""}),
        }),
    deleteComment: (comment_id: string) => request<any>(`/comments/delete/${comment_id}`, {method: 'DELETE'}),
    updateComment: (concept_id: string, content: string) =>
        request<any>(`/comments/update/${concept_id}`, {
            method: 'PATCH',
            body: JSON.stringify({content}),
        }),
    addFavorite: (general_id: string, type: string) =>
        request<any>(`/user/favorite/add/${general_id}`, {
            method: 'POST',
            body: JSON.stringify({type, user_id: String(Token.getUserIdFromToken()) || ""}),
        }),
    deleteFavorite: (general_id: string, type: string) =>
        request<any>(`/user/favorite/delete/${general_id}`, {
            method: 'DELETE',
            body: JSON.stringify({type, user_id: String(Token.getUserIdFromToken()) || ""}),
        }),
    rollbackConcept: (id: string, data: RollbackConcept) =>
        request<any>(`/concept/rollback/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                version_number: data.version_number,
                field_modified: data.field_modified,
                username: data.username
            }),
        }),
    createRelation: (dico: {}) =>
        request<any>(`/relation/create`, {
            method: 'POST',
            body: JSON.stringify({value: dico}),
        }),
    createCategory: (nom: string) => request<any>(`/category/create`, {
        method: 'POST',
        body: JSON.stringify({value: nom})
    }),
    createType: (nom: string) => request<any>(`/type/create`, {method: 'POST', body: JSON.stringify({value: nom})}),
    createMathematicien: (nom: string) => request<any>(`/mathematicien/create`, {
        method: 'POST',
        body: JSON.stringify({value: nom})
    }),
    createAlias: (id: number, nom: string) => request<any>(`/alias/create`, {
        method: 'POST',
        body: JSON.stringify({id, value: nom})
    }),
    createSources: (sources: any) => request<any>(`/source/create`, {
        method: 'POST',
        body: JSON.stringify({value: sources})
    }),
    updateOneMathematicien: (id: string, field: string, value: any) =>
        request<any>(`/mathematicien/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    updateOneCategory: (id: string, field: string, value: any) =>
        request<any>(`/category/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    updateOneType: (id: string, field: string, value: any) =>
        request<any>(`/type/update/${id}`, {method: 'PATCH', body: JSON.stringify({field, value})}),
    requestPasswordReset: (email: string) =>
        request<any>(`/password-reset/request`, {method: 'POST', body: JSON.stringify({email})}, false),
    resetPassword: (token: string, password: string) =>
        request<any>(`/password-reset/confirm`, {
            method: 'POST',
            body: JSON.stringify({token, new_password: password})
        }, false),
    removeTagsFromConceptId: (concept_id: number, tags_id: number) =>
        request<any>(`/tags/remove/concept`, {method: 'POST', body: JSON.stringify({concept_id, tag_id: tags_id})}),
    createTags: (tags: string) => request<any>(`/tags/add`, {method: 'POST', body: JSON.stringify({tag_name: tags})}),
    createLinkTagConcept: (concept_id: number, tags_id: number) =>
        request<any>(`/tags/add/concept`, {method: 'POST', body: JSON.stringify({concept_id, tag_id: tags_id})}),
    patchUser: (data: { field: string, value: string }, id: string) =>
        request<any>(`/user/update/${id}`, {method: 'PATCH', body: JSON.stringify(data)}),
    getToken: (formData: URLSearchParams) =>
        request<any>(`/token`, {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData.toString(),
        }, false),
    register: (username: string, email: string, password: string) =>
        request<any>(`/register`, {method: "POST", body: JSON.stringify({username, email, password})}, false),
};

// No longer needed after centralization
// export const handleError = ...