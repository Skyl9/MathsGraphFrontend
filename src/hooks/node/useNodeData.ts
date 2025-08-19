// hooks/useNodeData.ts
import {useState, useCallback, useEffect} from 'react';
import {AllNodeData} from '../../types/types';
import {nodeApi} from '../../services/api';
import Token from '../../services/token';


export const useNodeData = (id: string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editableFieldsOptions, setEditableFieldsOptions] = useState<Record<keyof AllNodeData, string[]>>({
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
    });


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedData = await nodeApi.getConcept(id);
            setData(fetchedData);

        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOptions = useCallback(async () => {

        try {
            const options = await nodeApi.getEditableFieldsOptions();
            setEditableFieldsOptions(options);
        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
        }
    }, [id]);

    useEffect(() => {
        fetchData();

    }, [fetchData]);
    useEffect(
        () => {
            fetchOptions();
        },
        [fetchOptions]
    )


    const updateField = async (field: keyof AllNodeData, value: any) => {
        try {
            const username = Token.getUsernameFromToken();
            if (!username) {
                throw new Error("Utilisateur non authentifié");
            }

            await nodeApi.updateNode(id, field, value, username);
            await fetchData();
            return true;
        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
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
            await fetchData();
            await fetchOptions();

        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
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
        refetchData: fetchData,
        createField
    };
};