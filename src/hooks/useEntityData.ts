// src/hooks/useEntityData.ts
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { nodeApi } from "../services/api";

export type EntityType = "category" | "type" | "mathematicien";

const ENTITY_CONFIG = {
    category: {
        get: nodeApi.getOneCategory,
        update: nodeApi.updateOneCategory,
        defaultFields: { id: [], nom: [], description: [], parent_id: [] }
    },
    type: {
        get: nodeApi.getOneType,
        update: nodeApi.updateOneType,
        defaultFields: { id: [], type: [] }
    },
    mathematicien: {
        get: nodeApi.getOneMathematicien,
        update: nodeApi.updateOneMathematicien,
        defaultFields: { id: [], nom: [], date_naissance: [], date_deces: [], biographie: [], nationalite: [], domaine: [], url: [], recompenses: [], epoque: [], created_at: [], updated_at: [] }
    }
};

export const useEntityData = <T extends object>(entityType: EntityType, id: string) => {
    const config = ENTITY_CONFIG[entityType];
    const queryClient = useQueryClient();

    const {
        data,
        isLoading: loading,
        error: queryError,
        refetch: refetchData
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

    const [mutationError, setMutationError] = useState<string | null>(null);

    const finalError = queryError ? queryError.message : mutationError;

    const setData = (newData: T) => {
        queryClient.setQueryData([entityType, id], newData);
    };

    const updateField = async (field: keyof T, value: unknown) => {
        try {
            setMutationError(null);
            await config.update(id, field as string, value);

            await queryClient.invalidateQueries({ queryKey: [entityType, id] });
            return true;
        } catch (err) {
            setMutationError(err instanceof Error ? err.message : 'An unknown error occurred.');
            return false;
        }
    };

    const createField = async (field: string, value: unknown) => {
        try {
            setMutationError(null);
            const val = value as Record<string, unknown>; // Temporary cast for polymorphic payload
            switch (field.toLowerCase()) {
                case "categorie": await nodeApi.createCategory(value as string); break;
                case "aliases": await nodeApi.createAlias(val.id as number, val.value as string); break;
                case "mathematicien": await nodeApi.createMathematicien(value as string); break;
                case "relations": await nodeApi.createRelation(value as Record<string, unknown>); break;
                case "sources": await nodeApi.createSources(value); break;
                case "type": await nodeApi.createType(value as string); break;
                default: console.log("Champ de création non géré:", field);
            }

            await queryClient.invalidateQueries({ queryKey: [entityType, id] });
        } catch (err) {
            setMutationError(err instanceof Error ? err.message : 'An unknown error occurred.');
            return false;
        }
    };

    return {
        data: data || null,
        setData,
        loading,
        error: finalError,
        editableFieldsOptions,
        refetchData,
        updateField,
        createField
    };
};