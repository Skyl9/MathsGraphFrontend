import {useCallback, useEffect, useState} from "react";
import {Type} from "../../types/types";
import {nodeApi} from "../../services/api";

export const useTypeData = (id:string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editableFieldsOptions, setEditableFieldsOptions] = useState<Record<keyof Type, string[]>>({
        id:[],
        type:[],
    });


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const typeFetch = await nodeApi.getOneType(id);
            setData(typeFetch);

        } catch (err) {
            setError(nodeApi.handleError(err));
        } finally {
            setLoading(false);
        }
    }, [id]);




    useEffect(() => {
        fetchData().then(r => console.log("Fetching TypeData..."));
    },[fetchData]);

    const updateField = async (field: keyof Type, value: any) => {
        try {
            await nodeApi.updateOneType(id, field, value);
            await fetchData();
            return true;
        } catch (err) {
            setError(nodeApi.handleError(err));
            return false;
        }
    };

    const createField = async (field: keyof Type, value: any) => {
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
                    await nodeApi.createAlias(value["id"],value["value"]);
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


                default:
                    console.log("Champs non trouvé")
            }
            await fetchData();

        }catch (err) {
            setError(nodeApi.handleError(err));
            return false;
        }
    }

    return{
        data,
        setData,
        loading,
        error,
        editableFieldsOptions,
        refetchData: fetchData,
        updateField,
        createField
    }

}