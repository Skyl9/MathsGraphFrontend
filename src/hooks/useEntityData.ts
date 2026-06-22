// src/hooks/useEntityData.ts
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import Token from "../services/token";

export type EntityType = "category" | "type" | "mathematicien" | "concept";

const ENTITY_CONFIG = {
  category: {
    get: nodeApi.getOneCategory,
    update: nodeApi.updateOneCategory,
    defaultFields: { id: [], nom: [], description: [], parent_id: [] },
  },
  type: {
    get: nodeApi.getOneType,
    update: nodeApi.updateOneType,
    defaultFields: { id: [], type: [] },
  },
  mathematicien: {
    get: nodeApi.getOneMathematicien,
    update: nodeApi.updateOneMathematicien,
    defaultFields: {
      id: [],
      nom: [],
      date_naissance: [],
      date_deces: [],
      biographie: [],
      nationalite: [],
      domaine: [],
      url: [],
      recompenses: [],
      epoque: [],
      created_at: [],
      updated_at: [],
    },
  },
  concept: {
    get: nodeApi.getConcept,
    update: (id: string, field: string, value: unknown) =>
      nodeApi.updateConcept(
        id,
        field,
        value,
        Token.getUsernameFromToken() || "",
      ),
    defaultFields: {
      id: [],
      type: [],
      enonce: [],
      demonstration: [],
      mathematicien: [],
      nom: [],
      categorie: [],
      aliases: [],
      date_ajout: [],
      relations: [],
      sources: [],
      verification: [],
      noms_etrangers: [],
      tags: [],
      date_modification: [],
    },
  },
};

export const useEntityData = <T extends object>(
  entityType: EntityType,
  id: string,
) => {
  const config = ENTITY_CONFIG[entityType];
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch: refetchData,
  } = useQuery<T, Error>({
    queryKey: [entityType, id],
    queryFn: async () => {
      console.log(`Fetching ${entityType} Data via API...`);
      const result = await config.get(id);
      return result as unknown as T;
    },
    enabled: !!id,
  });

  const [editableFieldsOptions] = useState(config.defaultFields);

  const updateMutation = useMutation({
    mutationFn: async ({
      field,
      value,
    }: {
      field: keyof T;
      value: unknown;
    }) => {
      await config.update(id, field as string, value);
    },
    onMutate: async ({ field, value }) => {
      const queryKey = [entityType, id];
      // 1. Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey });
      // 2. Sauvegarder l'état précédent
      const previousData = queryClient.getQueryData<T>(queryKey);
      // 3. Mise à jour optimiste du cache
      if (previousData) {
        queryClient.setQueryData<T>(queryKey, {
          ...previousData,
          [field]: value,
        });
      }
      return { previousData };
    },
    onError: (_err, _newTodo, context) => {
      // 4. Rollback en cas d'erreur
      if (context?.previousData) {
        queryClient.setQueryData([entityType, id], context.previousData);
      }
    },
    onSettled: () => {
      // 5. Re-synchroniser avec le serveur
      queryClient.invalidateQueries({ queryKey: [entityType, id] });
      queryClient.invalidateQueries({ queryKey: ["graphData"] });
    },
  });

  const updateField = async (field: keyof T, value: unknown) => {
    try {
      await updateMutation.mutateAsync({ field, value });
      return true;
    } catch {
      return false;
    }
  };

  const isString = (v: unknown): v is string => typeof v === "string";
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const createMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: unknown }) => {
      switch (field.toLowerCase()) {
        case "categorie":
          if (!isString(value))
            throw new Error("Format invalide pour categorie (string attendue)");
          await nodeApi.createCategory(value);
          break;
        case "aliases":
          if (
            !isObject(value) ||
            typeof value.id !== "number" ||
            typeof value.value !== "string"
          ) {
            throw new Error(
              "Format invalide pour aliases (objet avec id: number, value: string attendu)",
            );
          }
          await nodeApi.createAlias(value.id, value.value);
          break;
        case "mathematicien":
          if (!isString(value))
            throw new Error(
              "Format invalide pour mathematicien (string attendue)",
            );
          await nodeApi.createMathematicien(value);
          break;
        case "relations":
          if (!isObject(value))
            throw new Error("Format invalide pour relations (objet attendu)");
          await nodeApi.createRelation(value);
          break;
        case "sources":
          await nodeApi.createSources(value);
          break;
        case "type":
          if (!isString(value))
            throw new Error("Format invalide pour type (string attendue)");
          await nodeApi.createType(value);
          break;
        default:
          console.log("Champ de création non géré:", field);
          throw new Error("Champ de création non géré: " + field);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [entityType, id] });
      queryClient.invalidateQueries({ queryKey: ["graphData"] });
    },
  });

  const createField = async (field: string, value: unknown) => {
    try {
      await createMutation.mutateAsync({ field, value });
    } catch {
      return false;
    }
  };

  const finalError = queryError
    ? queryError.message
    : updateMutation.error?.message || createMutation.error?.message || null;

  const setData = (newData: T) => {
    queryClient.setQueryData([entityType, id], newData);
  };

  return {
    data: data || null,
    setData,
    loading,
    error: finalError,
    editableFieldsOptions,
    refetchData,
    updateField,
    createField,
  };
};
