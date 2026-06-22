// src/services/api.ts
import { AllNodeData, RollbackConcept } from "../types/types";
import Token from "./token";
import { ConceptName, GetConcept, History } from "../types/ApiTypes/concept";
import { accessTokens, Register } from "../types/ApiTypes/auth";
import {
  Mathematicien,
  MathematicienName,
} from "../types/ApiTypes/mathematicien";
import { Category, CategoryName } from "../types/ApiTypes/category";
import { Type } from "../types/ApiTypes/type";
import { Favorite, User } from "../types/ApiTypes/user";
import { Tag } from "../types/ApiTypes/tag";
import { Comment } from "../types/ApiTypes/comments";
import {
  AdminStats,
  ContentAdmin,
  ApiAnalytics,
  RecentActivityItem,
} from "../types/ApiTypes/admin";
import { NodeData, EdgeData } from "../types/ApiTypes/graph";
import { RecentChange } from "../types/ApiTypes/concept";
import { RecentComment } from "../types/ApiTypes/comments";
import { toast } from "react-toastify";

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: {
      VITE_BACKEND_LINK?: string;
    };
  }
}

// --- Types ---
export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export interface MathTimelineData {
  id: number;
  nom: string;
  date_naissance: string;
  date_deces?: string;
  epoque?: string;
  biographie?: string;
}

export interface SearchResult {
  id: number | string;
  nom: string;
  entity_type: string;
  extrait?: string;
}

export interface SearchFilters {
  concept: boolean;
  mathematicien: boolean;
  category: boolean;
  verifiedOnly: boolean;
  categorie_id?: number | null;
  type_id?: number | null;
  mathematicien_id?: number | null;
  date_start?: string | null;
  date_end?: string | null;
}

const runtimeEnv = window.__RUNTIME_CONFIG__?.VITE_BACKEND_LINK;
const BASE_URL =
  runtimeEnv || import.meta.env.VITE_BACKEND_LINK || "http://localhost:8000";
// Define a unified error structure
export interface ApiError {
  status: number;
  code?: string;
  message: string;
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "message" in error &&
    typeof (error as Record<string, unknown>).status === "number" &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

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
  _authRequired: boolean = true,
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options?.headers || {}), // Fusionne les en-têtes
  });

  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
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
        console.warn(
          "Session expirée ou token invalide. Déconnexion automatique.",
        );
        Token.clearToken();
        // On évite les boucles infinies de redirection et on ne redirige que si l'authentification est requise
        if (
          _authRequired &&
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/register"
        ) {
          toast.info(
            "Veuillez vous connecter pour accéder à cette fonctionnalité.",
          );
          window.location.href = "/login?session_expired=true";
        }
      } else if (config.method && config.method !== "GET") {
        // Afficher un toast d'erreur uniquement pour les mutations (POST, PATCH, DELETE)
        toast.error(error.message);
      }

      throw error;
    }

    // Afficher un toast de succès générique pour les requêtes POST/PATCH/DELETE (Optionnel, ou à la demande)
    // Mais on préférera généralement les afficher côté UI pour plus de contexte.

    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      toast.error("La requête a expiré. Veuillez vérifier votre connexion.");
      throw { status: 408, message: "La requête a expiré." } as ApiError;
    }
    // Ne pas afficher de toast ici si on l'a déjà fait au-dessus
    if (!isApiError(error) && config.method && config.method !== "GET") {
      toast.error("Erreur réseau ou serveur injoignable.");
    }
    throw error;
  }
};

export const nodeApi = {
  // GET requests
  getConcept: (id: string) =>
    request<GetConcept>(`/concept/${id}`, undefined, false),
  getComments: (concept_id: string) =>
    request<Comment[]>(`/comments/${concept_id}`, undefined, false),
  getAllUsers: () => request<User[]>(`/admin/users`),
  getAllContents: () => request<ContentAdmin[]>(`/admin/contents`),
  getAdminStats: () => request<AdminStats>(`/admin/stats`),
  getFavorites: (user_id?: string) =>
    request<Favorite[]>(
      `/user/favorite/${user_id || Token.getUserIdFromToken() || ""}`,
      undefined,
      false,
    ),
  getCategoryId: (name: string) =>
    request<CategoryName>(`/category/name/${name}`, undefined, false),
  getMathematicienId: (name: string) =>
    request<Mathematicien>(`/mathematicien/name/${name}`, undefined, false),
  getTypeId: (name: string) =>
    request<Type>(`/type/name/${name}`, undefined, false),
  getConceptHistory: (conceptId: string) =>
    request<History[]>(`/concept/history/${conceptId}`, undefined, false),
  getEditableFieldsOptions: () =>
    request<EditableFieldsOptions>(
      `/getEditableFieldsOptions`,
      undefined,
      false,
    ),
  getOneMathematicien: (id: string) =>
    request<Mathematicien>(`/mathematicien/${id}`, undefined, false),
  getOneType: (id: string) => request<Type>(`/type/${id}`, undefined, false),
  getOneCategory: (id: string) =>
    request<Category>(`/category/${id}`, undefined, false),
  getAllCategories: () => request<Category[]>(`/category/`, undefined, false),
  getAllMathematicienName: () =>
    request<MathematicienName[]>(`/mathematicien/`, undefined, false),
  getAllTypeNames: () => request<Type[]>(`/type/`, undefined, false),
  getAllConceptNames: () =>
    request<ConceptName[]>(`/getAllConceptName`, undefined, false),
  getUserInfo: (id: string) => request<User>(`/user/${id}`, undefined, false),
  getUserIdByUsername: (username: string) =>
    request<{ id: number }>(`/user/id/${username}`, undefined, false),
  getTagsNameFromConceptId: (id: string) =>
    request<Tag[]>(`/tags/name/concept_id/${id}`, undefined, false),
  getAllTagName: () => request<Tag[]>(`/tags/all`, undefined, false),
  getGraph: () => request<GraphData>(`/graph`, undefined, false),
  getRecentHistory: (limit: number = 20) =>
    request<RecentChange[]>(`/recent-history?limit=${limit}`, undefined, false),
  getRecentComments: (limit: number = 20) =>
    request<RecentComment[]>(
      `/comments/recent?limit=${limit}`,
      undefined,
      false,
    ), // CORRIGÉ
  getUserContributions: (userId: string, limit: number = 20) =>
    request<RecentChange[]>(
      `/user/history/${userId}?limit=${limit}`,
      undefined,
      false,
    ),
  getMathematiciensTimeline: () =>
    request<MathTimelineData[]>("/mathematicien/timeline/all"),
  quickSearch: (inputValue: string) =>
    request<SearchResult[]>(
      `/search/quick?q=${encodeURIComponent(inputValue)}`,
    ),
  advanceSearch: (queryTerm: string, filter: SearchFilters) =>
    request<SearchResult[]>(
      "/search/advanced",
      {
        method: "POST",
        body: JSON.stringify({ q: queryTerm, filters: filter }),
      },
      false,
    ),
  getApiAnalytics: () => request<ApiAnalytics>(`/admin/analytics`),
  getRecentActivity: (limit: number = 10) =>
    request<RecentActivityItem[]>(`/admin/recent-activity?limit=${limit}`),
  recordConceptView: (id: string) =>
    request<null>(`/statistics/concepts/${id}`, { method: "POST" }, false),
  // POST/PATCH/DELETE requests
  updateConcept: (
    id: string,
    field: string,
    value: unknown,
    username: string,
  ) =>
    request<null>(`/concept/${id}`, {
      // 🌟 REST: /concept/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value, username }),
    }),
  postComment: (
    concept_id: string,
    parent_id: number,
    field: string,
    comment: string,
  ) =>
    request<null>(`/comments/${concept_id}`, {
      // 🌟 REST: /comments/{id}
      method: "POST",
      body: JSON.stringify({
        field,
        parent_id,
        content: comment,
        username: Token.getUsernameFromToken() || "",
      }),
    }),
  deleteComment: (comment_id: string) =>
    request<null>(`/comments/${comment_id}`, { method: "DELETE" }), // 🌟 REST: /comments/{id}
  updateComment: (concept_id: string, content: string) =>
    request<null>(`/comments/${concept_id}`, {
      // 🌟 REST: /comments/{id}
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),
  addFavorite: (general_id: string, type: string) =>
    request<null>(`/user/favorite/${general_id}`, {
      // 🌟 REST: /user/favorite/{id}
      method: "POST",
      body: JSON.stringify({
        type,
        user_id: String(Token.getUserIdFromToken()) || "",
      }),
    }),
  deleteFavorite: (general_id: string, type: string) =>
    request<null>(`/user/favorite/${general_id}`, {
      // 🌟 REST: /user/favorite/{id}
      method: "DELETE",
      body: JSON.stringify({
        type,
        user_id: String(Token.getUserIdFromToken()) || "",
      }),
    }),
  rollbackConcept: (id: string, data: RollbackConcept) =>
    request<null>(`/concept/rollback/${id}`, {
      // On tolère "rollback" car c'est une action spécifique (RPC)
      method: "PATCH",
      body: JSON.stringify({
        version_number: data.version_number,
        field_modified: data.field_modified,
        username: data.username,
      }),
    }),
  createRelation: (dico: Record<string, unknown>) =>
    request<null>(`/relation`, {
      // 🌟 REST: /relation
      method: "POST",
      body: JSON.stringify({ value: dico }),
    }),
  createCategory: (nom: string) =>
    request<null>(`/category`, {
      // 🌟 REST: /category
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createType: (nom: string) =>
    request<null>(`/type`, {
      // 🌟 REST: /type
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createMathematicien: (nom: string) =>
    request<null>(`/mathematicien`, {
      // 🌟 REST: /mathematicien
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createAlias: (id: number, nom: string) =>
    request<null>(`/alias`, {
      // 🌟 REST: /alias
      method: "POST",
      body: JSON.stringify({ id, value: nom }),
    }),
  createSources: (sources: unknown) =>
    request<null>(`/source`, {
      // 🌟 REST: /source
      method: "POST",
      body: JSON.stringify({ value: sources }),
    }),
  updateOneMathematicien: (id: string, field: string, value: unknown) =>
    request<null>(`/mathematicien/${id}`, {
      // 🌟 REST: /mathematicien/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),
  updateOneCategory: (id: string, field: string, value: unknown) =>
    request<null>(`/category/${id}`, {
      // 🌟 REST: /category/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),
  updateOneType: (id: string, field: string, value: unknown) =>
    request<null>(`/type/${id}`, {
      // 🌟 REST: /type/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),

  requestPasswordReset: (email: string) =>
    request<null>(
      `/password-reset/request`,
      { method: "POST", body: JSON.stringify({ email }) },
      false,
    ),
  resetPassword: (token: string, password: string) =>
    request<null>(
      `/password-reset/confirm`,
      {
        method: "POST",
        body: JSON.stringify({ token, new_password: password }),
      },
      false,
    ),

  // 🌟 LA ROUTE CORRIGÉE PRÉCÉDEMMENT
  removeTagsFromConceptId: (concept_id: number, tags_id: number) =>
    request<null>(`/tags/concept/${concept_id}/tag/${tags_id}`, {
      method: "DELETE",
    }),

  createTags: (tags: string) =>
    request<null>(`/tags`, {
      // 🌟 REST: /tags
      method: "POST",
      body: JSON.stringify({ tag_name: tags }),
    }),
  createLinkTagConcept: (concept_id: number, tags_id: number) =>
    request<null>(`/tags/concept`, {
      // 🌟 REST: /tags/concept
      method: "POST",
      body: JSON.stringify({ concept_id, tag_id: tags_id }),
    }),
  patchUser: (data: { field: string; value: string }, id: string) =>
    request<null>(`/user/${id}`, {
      // 🌟 REST: /user/{id}
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  register: (username: string, email: string, password: string) =>
    request<Register>(
      `/register`,
      {
        method: "POST",
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      },
      false,
    ),
  recalculateGraph: () =>
    request<string>(`/admin/recalculate-graph`, { method: "POST" }),

  logout: () => request<null>("/logout", { method: "POST" }, false),
  createConcept: (data: {
    nom: string;
    type: string;
    enonce: string;
    demonstration?: string;
    categorie_id?: number | null;
    mathematicien_id?: number | null;
  }) =>
    request<{ id: number; nom: string }>(`/concept`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMe: () => request<import("./token").UserPayload>(`/me`, undefined, false),
  getToken: async (formData: URLSearchParams): Promise<accessTokens> => {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message:
          errorData.detail ||
          "Erreur d'authentification : Identifiants invalides",
      } as ApiError;
    }
    return await response.json();
  },
};
