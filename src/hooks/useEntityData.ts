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

export const useEntityData = <T,>(entityType: EntityType, id: string) => {
    const config = ENTITY_CONFIG[entityType];
    const queryClient = useQueryClient();

    const {
        data,
        isLoading: loading,
        error: queryError,
        refetch: refetchData
    } = useQuery({
        queryKey: [entityType, id],
        queryFn: async () => {
            console.log(`Fetching ${entityType} Data via API...`);
            const result = await config.get(id);
            return result as unknown as T;
        },
        enabled: !!id,
    });

    const [editableFieldsOptions] = useState<any>(config.defaultFields);

    const [mutationError, setMutationError] = useState<string | null>(null);

    const finalError = queryError ? (queryError as Error).message : mutationError;

    const setData = (newData: T) => {
        queryClient.setQueryData([entityType, id], newData);
    };

    const updateField = async (field: keyof T, value: any) => {
        try {
            setMutationError(null);
            await config.update(id, field as string, value);

            await queryClient.invalidateQueries({ queryKey: [entityType, id] });
            return true;
        } catch (err: any) {
            setMutationError(err.message || 'An unknown error occurred.');
            return false;
        }
    };

    const createField = async (field: string, value: any) => {
        try {
            setMutationError(null);
            switch (field.toLowerCase()) {
                case "categorie": await nodeApi.createCategory(value); break;
                case "aliases": await nodeApi.createAlias(value.id, value.value); break;
                case "mathematicien": await nodeApi.createMathematicien(value); break;
                case "relations": await nodeApi.createRelation(value); break;
                case "sources": await nodeApi.createSources(value); break;
                case "type": await nodeApi.createType(value); break;
                default: console.log("Champ de création non géré:", field);
            }

            await queryClient.invalidateQueries({ queryKey: [entityType, id] });
        } catch (err: any) {
            setMutationError(err.message || 'An unknown error occurred.');
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