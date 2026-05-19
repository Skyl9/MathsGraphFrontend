import {AllNodeData} from '../../types/types';
import {EditableFieldsOptions, nodeApi} from '../../services/api';
import Token from '../../services/token';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useNodeData = (id: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading: loading, error: queryError, refetch: refetchData } = useQuery<AllNodeData>({
        queryKey: ['concept', id],
        queryFn: () => nodeApi.getConcept(id),
        enabled: !!id
    });

    const { data: editableFieldsOptions = {
        type: [],
        enonce: [],
        demonstration: [],
        mathematicien: [],
        categorie: [],
        id: [],
        nom: [],
        aliases: [],
        date_ajout: [],
        relations: [],
        sources: [],
        verification: [],
        noms_etrangers: [],
        tags: [],
        date_modification:[]
    } as EditableFieldsOptions } = useQuery<EditableFieldsOptions>({
        queryKey: ['editableFieldsOptions'],
        queryFn: () => nodeApi.getEditableFieldsOptions()
    });

    const error = queryError instanceof Error ? queryError.message : (queryError ? String(queryError) : null);

    const setData = (newData: AllNodeData) => {
        queryClient.setQueryData(['concept', id], newData);
    };

    const updateField = async (field: keyof AllNodeData, value: unknown) => {
        try {
            const username = Token.getUsernameFromToken();
            if (!username) {
                throw new Error("Utilisateur non authentifié");
            }

            await nodeApi.updateConcept(id, field, value, username);
            await queryClient.invalidateQueries({ queryKey: ['concept', id] });
            return true;
        } catch (err) {
            console.error("Erreur lors de la mise à jour du champ", err);
            return false;
        }

    };

    const createField = async (field: keyof AllNodeData, value: unknown) => {
        try {
            console.log(field.toLowerCase());
            switch (field.toLowerCase()) {
                case "id":
                case "nom":
                case "enonce":
                case "date_ajout":
                case "demonstration":
                case "verification":
                case "noms_etrangers":
                    break;
                case "categorie":
                    await nodeApi.createCategory(value as string);
                    break;
                case "aliases": {
                    const aliasData = value as { id: number; value: string };
                    await nodeApi.createAlias(aliasData.id, aliasData.value);
                    break;
                }
                case "mathematicien":
                    await nodeApi.createMathematicien(value as string);
                    break;
                case "relations":
                    await nodeApi.createRelation(value as Record<string, unknown>);
                    break;
                case "sources":
                    await nodeApi.createSources(value);
                    break;
                case "type":
                    await nodeApi.createType(value as string);
                    break;
                case "tags":
                    await nodeApi.createTags(value as string);
                    break;
                default:
                    console.log("Champs non trouvé")
            }
            await queryClient.invalidateQueries({ queryKey: ['concept', id] });
            await queryClient.invalidateQueries({ queryKey: ['editableFieldsOptions'] });

        } catch (err) {
            console.error("Erreur lors de la création du champ", err);
            return false;
        }
    }

    return {
        data,
        setData,
        loading,
        error,
        editableFieldsOptions,
        updateField,
        refetchData,
        createField
    };
};