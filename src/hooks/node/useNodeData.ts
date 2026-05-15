// hooks/useNodeData.ts
import {useCallback} from 'react';
import {AllNodeData} from '../../types/types';
import {nodeApi} from '../../services/api';
import Token from '../../services/token';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useNodeData = (id: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading: loading, error: queryError, refetch: refetchData } = useQuery({
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
    } } = useQuery({
        queryKey: ['editableFieldsOptions'],
        queryFn: () => nodeApi.getEditableFieldsOptions()
    });

    const error = queryError ? (queryError as any).message : null;

    const setData = (newData: any) => {
        queryClient.setQueryData(['concept', id], newData);
    };

    const updateField = async (field: keyof AllNodeData, value: any) => {
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

    const createField = async (field: keyof AllNodeData, value: any) => {
        try {
            console.log(field.toLowerCase());
            switch (field.toLowerCase()) {
                case "id":
                    break;
                case "nom":
                    break;
                case "enonce":
                    break;
                case "categorie":
                    await nodeApi.createCategory(value);
                    break;
                case "aliases":
                    await nodeApi.createAlias(value["id"], value["value"]);
                    break;
                case "mathematicien":
                    await nodeApi.createMathematicien(value);
                    break;
                case "date_ajout":
                    break;
                case "demonstration":
                    break;
                case "relations":
                    await nodeApi.createRelation(value);
                    break;
                case "sources":
                    await nodeApi.createSources(value);
                    break;
                case "verification":
                    break;
                case "noms_etrangers":
                    break;
                case "type":
                    await nodeApi.createType(value);
                    break;

                case "tags":
                    await nodeApi.createTags(value);
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