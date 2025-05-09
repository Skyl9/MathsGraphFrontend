const BASE_URL = process.env.REACT_APP_BACKEND_LINK || '';

export const nodeApi = {
    getNode: async (id: string) => {
        const response = await fetch(`${BASE_URL}/getNode/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getAllNodesNames: async () => {
        const response = await fetch(`${BASE_URL}/getAllNodesNames`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },

    updateNode: async (id: string, field: string, value: any) => {
        const response = await fetch(`${BASE_URL}/updateOneCategory/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({field, value})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        return response.json();
    },

    getEditableFieldsOptions: async (id: string) => {
        const response = await fetch(`${BASE_URL}/getEditableFieldsOptions`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },

    createRelation: async (dico: {}) => {
        const response = await fetch(`${BASE_URL}/createRelation`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": dico})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création de la catégorie");
        }
        return response.json();
    },


    createCategory: async (nom: string) => {
        const response = await fetch(`${BASE_URL}/createCategory`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": nom})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création de la catégorie");
        }
        return response.json();
    },
    createType: async (nom: string) => {
        const response = await fetch(`${BASE_URL}/createType`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": nom})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création du type");
        }
        return response.json();
    },
    createMathematicien: async (nom: string) => {
        const response = await fetch(`${BASE_URL}/createMathematicien`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": nom})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création du mathématicien");
        }
        return response.json();
    },
    createAlias: async (id: number, nom: string) => {
        const response = await fetch(`${BASE_URL}/createAlias`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"id": id, "value": nom})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création de l'alias");
        }
        return response.json();
    },
    createSources: async (sources: any) => {
        const response = await fetch(`${BASE_URL}/createSource`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": sources})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création de l'alias");
        }
        return response.json();
    },


    updateRelations: async (id: string, relations: any[]) => {
        return nodeApi.updateNode(id, 'relations', relations);
    },

    updateAliases: async (id: string, aliases: string[]) => {
        return nodeApi.updateNode(id, 'aliases', aliases);
    },
    getOneMathematicien: async (id: string) => {
        const response = await fetch(`${BASE_URL}/mathematicien/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getOneType: async (id: string) => {
        const response = await fetch(`${BASE_URL}/type/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getOneCategory: async (id: string) => {
        const response = await fetch(`${BASE_URL}/category/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    updateOneMathematicien: async (id: string, field: string, value: any) => {
        console.log(id, field, value);
        const response = await fetch(`${BASE_URL}/mathematicien/updateOneCategory/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"field":field, "value":value})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        console.log(response.json());
        return response.json();
    },
    updateOneCategory: async (id: string, field: string, value: any) => {
        console.log(id, field, value);
        const response = await fetch(`${BASE_URL}/category/update/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"field":field, "value":value})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        console.log(response.json());
        return response.json();
    },
    updateOneType: async (id: string, field: string, value: any) => {
        console.log(id, field, value);
        const response = await fetch(`${BASE_URL}/type/update/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"field":field, "value":value})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        console.log(response.json());
        return response.json();
    },

    handleError: (error: unknown) => {
        if (error instanceof Error) {
            return `Erreur : ${error.message}`;
        }
        return "Erreur inconnue";
    }
};