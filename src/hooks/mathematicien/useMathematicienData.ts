import {useCallback, useEffect, useState} from "react";
import {nodeApi} from "../../services/api";
import {Mathematicien} from "../../types/ApiTypes/mathematicien";

export const useMathematicienData = (id:string) => {
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editableFieldsOptions, setEditableFieldsOptions] = useState<Record<keyof Mathematicien, string[]>>({
        id:[],
        nom:[],
        date_naissance:[],
        date_deces:[],
        biographie:[],
        nationalite:[],
        domaine:[],
        url:[],
        recompenses:[],
        epoque:[],
        created_at:[],
        updated_at:[],
    });


    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const mathematicienFetch = await nodeApi.getOneMathematicien(id);
            setData(mathematicienFetch);

        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id]);




    useEffect(() => {
        fetchData().then(r => console.log("Fetching MathematicienData..."));
    },[fetchData]);

    const updateField = async (field: keyof Mathematicien, value: any) => {
        try {
            await nodeApi.updateOneMathematicien(id, field, value);
            await fetchData();
            return true;
        } catch (err) {
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
            return false;
        }
    };

    const createField = async (field: keyof Mathematicien, value: any) => {
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
            const errorMessage = (err as any).message || 'An unknown error occurred.';
            setError(errorMessage);
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