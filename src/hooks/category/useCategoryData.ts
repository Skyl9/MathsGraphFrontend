import {useCallback, useEffect, useState} from "react";
import {Category,} from "../../types/types";
import {nodeApi} from "../../services/api";

export const useCategoryData = (id:string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editableFieldsOptions, setEditableFieldsOptions] = useState<Record<keyof Category, string[]>>({
        id:[],
        nom:[],
        description:[],
    });


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const CategoryFetch = await nodeApi.getOneCategory(id);
            setData(CategoryFetch);

        } catch (err) {
            setError(nodeApi.handleError(err));
        } finally {
            setLoading(false);
        }
    }, [id]);




    useEffect(() => {
        fetchData().then(r => console.log("Fetching CategoryData..."));
    },[fetchData]);

    const updateField = async (field: keyof Category, value: any) => {
        try {
            await nodeApi.updateOneCategory(id, field, value);
            await fetchData();
            return true;
        } catch (err) {
            setError(nodeApi.handleError(err));
            return false;
        }
    };

    const createField = async (field: keyof Category, value: any) => {
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