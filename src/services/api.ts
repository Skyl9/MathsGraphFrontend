// src/services/api.ts
import { AllNodeData, RollbackConcept } from "../types/types";
import Token from "./token";
import {
  ConceptName,
  GetConcept,
  History,
  WantedConcept,
} from "../types/ApiTypes/concept";
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
import { captureException } from "./logger";

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
const SLOW_REQUEST_THRESHOLD_MS = 3000;

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

  // Toast "chargement long" déclenché après SLOW_REQUEST_THRESHOLD_MS sur les mutations
  const isMutation = config.method && config.method !== "GET";
  let slowToastId: ReturnType<typeof toast.loading> | null = null;
  const slowToastTimer = isMutation
    ? setTimeout(() => {
        slowToastId = toast.loading("Chargement long en cours...", {
          toastId: `slow-request-${endpoint}`,
        });
      }, SLOW_REQUEST_THRESHOLD_MS)
    : null;

  const dismissSlowToast = () => {
    if (slowToastTimer) clearTimeout(slowToastTimer);
    if (slowToastId !== null) toast.dismiss(slowToastId);
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    clearTimeout(timeoutId);
    dismissSlowToast();

    let data: ApiResponse<T>;
    if (response.status === 204) {
      data = {
        success: true,
        data: null,
        error: null,
        meta: null,
      } as unknown as ApiResponse<T>;
    } else {
      data = await response.json();
    }

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
    dismissSlowToast();
    if (error instanceof DOMException && error.name === "AbortError") {
      toast.error("La requête a expiré. Veuillez vérifier votre connexion.");
      throw { status: 408, message: "La requête a expiré." } as ApiError;
    }
    // Ne pas afficher de toast ici si on l'a déjà fait au-dessus
    if (!isApiError(error) && config.method && config.method !== "GET") {
      toast.error("Erreur réseau ou serveur injoignable.");
    }

    if (isApiError(error)) {
      captureException(
        new Error(`API Error: ${error.status} ${error.message}`),
        { endpoint, method: config.method, error },
      );
    } else {
      captureException(
        error instanceof Error ? error : new Error(String(error)),
        { endpoint, method: config.method },
      );
    }

    throw error;
  }
};

export const nodeApi = {
  // GET requests
  getConcept: (id: string) =>
    request<GetConcept>(`/concepts/${id}`, undefined, false),
  getComments: (concept_id: string) =>
    request<Comment[]>(`/comments/${concept_id}`, undefined, false),
  getAllUsers: () => request<User[]>(`/admin/users`),
  getAllContents: () => request<ContentAdmin[]>(`/admin/contents`),
  getAdminStats: () => request<AdminStats>(`/admin/stats`),
  getFavorites: (user_id?: string) =>
    request<Favorite[]>(
      `/users/favorite/${user_id || Token.getUserIdFromToken() || ""}`,
      undefined,
      false,
    ),
  getCategoryId: (name: string) =>
    request<CategoryName>(`/categories/name/${name}`, undefined, false),
  getMathematicienId: (name: string) =>
    request<Mathematicien>(`/mathematiciens/name/${name}`, undefined, false),
  getTypeId: (name: string) =>
    request<Type>(`/types/name/${name}`, undefined, false),
  getConceptHistory: (conceptId: string) =>
    request<History[]>(`/concepts/history/${conceptId}`, undefined, false),
  getEditableFieldsOptions: () =>
    request<EditableFieldsOptions>(
      `/concepts/getEditableFieldsOptions`,
      undefined,
      false,
    ),
  getOneMathematicien: (id: string) =>
    request<Mathematicien>(`/mathematiciens/${id}`, undefined, false),
  getOneType: (id: string) => request<Type>(`/types/${id}`, undefined, false),
  getOneCategory: (id: string) =>
    request<Category>(`/categories/${id}`, undefined, false),
  getAllCategories: () => request<Category[]>(`/categories/`, undefined, false),
  getAllMathematicienName: () =>
    request<MathematicienName[]>(`/mathematiciens/`, undefined, false),
  getAllTypeNames: () => request<Type[]>(`/types/`, undefined, false),
  getAllConceptNames: () =>
    request<ConceptName[]>(`/concepts/getAllConceptName`, undefined, false),
  getWantedConcepts: () =>
    request<WantedConcept[]>(`/concepts/wanted`, undefined, false),
  getUserInfo: (id: string) => request<User>(`/users/${id}`, undefined, false),
  getUserIdByUsername: (username: string) =>
    request<{ id: number }>(`/users/id/${username}`, undefined, false),
  getTagsNameFromConceptId: (id: string) =>
    request<Tag[]>(`/tags/name/concept_id/${id}`, undefined, false),
  getAllTagName: () => request<Tag[]>(`/tags/all`, undefined, false),
  getGraph: () => request<GraphData>(`/graph`, undefined, false),
  getRecentHistory: (limit: number = 20) =>
    request<RecentChange[]>(
      `/concepts/recent-history?limit=${limit}`,
      undefined,
      false,
    ),
  getRecentComments: (limit: number = 20) =>
    request<RecentComment[]>(
      `/comments/recent?limit=${limit}`,
      undefined,
      false,
    ), // CORRIGÉ
  getUserContributions: (userId: string, limit: number = 20) =>
    request<RecentChange[]>(
      `/users/history/${userId}?limit=${limit}`,
      undefined,
      false,
    ),
  getMathematiciensTimeline: () =>
    request<MathTimelineData[]>("/mathematiciens/timeline/all"),
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
    request<null>(`/concepts/${id}`, {
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
  addFavorite: (
    general_id: string,
    type: string,
    notify_on_change: boolean = false,
  ) =>
    request<null>(`/users/favorite/${general_id}`, {
      // 🌟 REST: /user/favorite/{id}
      method: "POST",
      body: JSON.stringify({
        type,
        user_id: String(Token.getUserIdFromToken()) || "",
        notify_on_change,
      }),
    }),
  deleteFavorite: (general_id: string, type: string) =>
    request<null>(`/users/favorite/${general_id}`, {
      // 🌟 REST: /user/favorite/{id}
      method: "DELETE",
      body: JSON.stringify({
        type,
        user_id: String(Token.getUserIdFromToken()) || "",
      }),
    }),
  rollbackConcept: (id: string, data: RollbackConcept) =>
    request<null>(`/concepts/rollback/${id}`, {
      // On tolère "rollback" car c'est une action spécifique (RPC)
      method: "PATCH",
      body: JSON.stringify({
        version_number: data.version_number,
        field_modified: data.field_modified,
        username: data.username,
      }),
    }),
  createRelation: (dico: Record<string, unknown>) =>
    request<null>(`/relations`, {
      // 🌟 REST: /relation
      method: "POST",
      body: JSON.stringify({ value: dico }),
    }),
  createCategory: (nom: string) =>
    request<null>(`/categories`, {
      // 🌟 REST: /category
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createType: (nom: string) =>
    request<null>(`/types`, {
      // 🌟 REST: /type
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createMathematicien: (nom: string) =>
    request<null>(`/mathematiciens`, {
      // 🌟 REST: /mathematicien
      method: "POST",
      body: JSON.stringify({ value: nom }),
    }),
  createAlias: (id: number, nom: string) =>
    request<null>(`/aliases`, {
      // 🌟 REST: /alias
      method: "POST",
      body: JSON.stringify({ id, value: nom }),
    }),
  createSources: (sources: unknown) =>
    request<null>(`/sources`, {
      // 🌟 REST: /source
      method: "POST",
      body: JSON.stringify({ value: sources }),
    }),
  updateOneMathematicien: (id: string, field: string, value: unknown) =>
    request<null>(`/mathematiciens/${id}`, {
      // 🌟 REST: /mathematicien/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),
  updateOneCategory: (id: string, field: string, value: unknown) =>
    request<null>(`/categories/${id}`, {
      // 🌟 REST: /category/{id}
      method: "PATCH",
      body: JSON.stringify({ field, value }),
    }),
  updateOneType: (id: string, field: string, value: unknown) =>
    request<null>(`/types/${id}`, {
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
    request<null>(`/users/${id}`, {
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
    request<{ id: number; nom: string }>(`/concepts`, {
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
  getNotifications: () =>
    request<import("../types/ApiTypes/notification").Notification[]>(
      "/notifications",
      undefined,
      false,
    ),
  markNotificationRead: (id: number) =>
    request<null>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllNotificationsRead: () =>
    request<null>("/notifications/read-all", { method: "PATCH" }),
};

export const draftApi = {
  getMyDrafts: () =>
    request<import("../types/ApiTypes/draft").Draft[]>("/drafts/me"),
  getDraft: (id: number) =>
    request<import("../types/ApiTypes/draft").Draft>(`/drafts/${id}`),
  createDraft: (data: import("../types/ApiTypes/draft").DraftCreate) =>
    request<import("../types/ApiTypes/draft").Draft>(`/drafts/`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDraft: (
    id: number,
    data: import("../types/ApiTypes/draft").DraftUpdate,
  ) =>
    request<import("../types/ApiTypes/draft").Draft>(`/drafts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  publishDraft: (id: number) =>
    request<{ message: string; concept_id: number }>(`/drafts/${id}/publish`, {
      method: "POST",
    }),
  deleteDraft: (id: number) =>
    request<{ message: string }>(`/drafts/${id}`, {
      method: "DELETE",
    }),
};
