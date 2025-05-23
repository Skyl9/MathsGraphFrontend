const BASE_URL = process.env.REACT_APP_BACKEND_LINK || '';

export const nodeApi = {
    getNode: async (id: string) => {
        const response = await fetch(`${BASE_URL}/concept/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    updateNode: async (id: string, field: string, value: any) => {
        const response = await fetch(`${BASE_URL}/update/${id}`, {
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
        const response = await fetch(`${BASE_URL}/relation/create`, {
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
        const response = await fetch(`${BASE_URL}/category/create`, {
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
        const response = await fetch(`${BASE_URL}/type/create`, {
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
        const response = await fetch(`${BASE_URL}/mathematicien/create`, {
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
        const response = await fetch(`${BASE_URL}/alias/create`, {
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
        const response = await fetch(`${BASE_URL}/source/create`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"value": sources})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création de l'alias");
        }
        return response.json();
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
        const response = await fetch(`${BASE_URL}/mathematicien/update/${id}`, {
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

    getAllCategories: async () => {
        const response = await fetch(`${BASE_URL}/category`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getAllMathematicienName: async () => {
        const response = await fetch(`${BASE_URL}/mathematicien`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getAllTypeNames: async () => {
        const response = await fetch(`${BASE_URL}/type`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getAllConceptNames: async () => {
        const response = await fetch(`${BASE_URL}/getAllConceptName`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getUserInfo: async (id:string) => {
        const response = await fetch(`${BASE_URL}/user/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return(response.json())
    },
    requestPasswordReset: async (email: string) => {
        const response = await fetch(`${BASE_URL}/password-reset/request`,
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"email":email})
        })
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    resetPassword: async (token: string, password: string) => {
        console.log(token, password);
        const response = await fetch(`${BASE_URL}/password-reset/confirm`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"token":token, "new_password":password})
        })
        return response.json();
    },
    getUserIdByUsername:async (username:string) => {
        const response = await fetch(`${BASE_URL}/user/id/${username}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getTagsNameFromConceptId:async (id:string) => {
        const response = await fetch(`${BASE_URL}/tags/name/concept_id/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },

    handleError: (error: unknown) => {
        if (error instanceof Error) {
            return `Erreur : ${error.message}`;
        }
        return "Erreur inconnue";
    },
    patchUser:async (data: {field: string,value:string}, id:string)=> {
        const response = await fetch(`${BASE_URL}/user/update/`+id, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        return response.json();
    }
};