import { useCallback, useEffect, useState } from "react";
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

    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editableFieldsOptions, _] = useState<any>(config.defaultFields);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await config.get(id);
            setData(result as unknown as T);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setLoading(false);
        }
    }, [id, config]);

    useEffect(() => {
        fetchData().then(() => console.log(`Fetching ${entityType} Data...`));
    }, [fetchData, entityType]);

    const updateField = async (field: keyof T, value: any) => {
        try {
            await config.update(id, field as string, value);
            await fetchData();
            return true;
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            return false;
        }
    };

    const createField = async (field: string, value: any) => {
        try {
            switch (field.toLowerCase()) {
                case "categorie": await nodeApi.createCategory(value); break;
                case "aliases": await nodeApi.createAlias(value.id, value.value); break;
                case "mathematicien": await nodeApi.createMathematicien(value); break;
                case "relations": await nodeApi.createRelation(value); break;
                case "sources": await nodeApi.createSources(value); break;
                case "type": await nodeApi.createType(value); break;
                default: console.log("Champ de création non géré:", field);
            }
            await fetchData();
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            return false;
        }
    };

    return {
        data,
        setData,
        loading,
        error,
        editableFieldsOptions,
        refetchData: fetchData,
        updateField,
        createField
    };
};