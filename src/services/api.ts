import {logger} from "../utils/logger";
import {RollbackConcept} from "../types/types";
import Token from "./token";

const BASE_URL = process.env.REACT_APP_BACKEND_LINK || '';

interface ResponseModel {
    data: any;
    error:string|null;
    success:boolean;
    meta:string|null;
}

export const nodeApi = {
    getConcept: async (id: string) => {
        const response = await fetch(`${BASE_URL}/concept/${id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    updateNode: async (id: string, field: string, value: any,username:string) => {
        const response = await fetch(`${BASE_URL}/update/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({field, value,username})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        return response.json();
    },

    getComments:async (concept_id:string)=>{
      const response = await fetch(`${BASE_URL}/comments/${concept_id}`);
      if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
      }
      return response.json();
    },
    postComment:async (concept_id:string,parent_id:number,field:string, comment:string)=>{
        const response = await fetch(`${BASE_URL}/comments/add/${concept_id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"field":field, "parent_id":parent_id, "content":comment, "username":Token.getUsernameFromToken()|| ""})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
        return response.json();
    },
    deleteComment:async (comment_id:string)=>{
        const response = await fetch(`${BASE_URL}/comments/delete/${comment_id}`, {
            method: 'DELETE',
        })
    },
    updateComment:async (concept_id:string,content:string)=>{
      const response = await fetch(`${BASE_URL}/comments/update/${concept_id}`,
          {
              method: 'PATCH',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({"content":content})
          });
    },
    getAllUsers:async ()=>{
        const response = await fetch(`${BASE_URL}/admin/users`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        const responseData:ResponseModel= await response.json();
        if (!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
    },
    getAllContents:async ()=>{
        const response = await fetch(`${BASE_URL}/admin/contents`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        const responseData:ResponseModel= await response.json();
        if (!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
    },
    getAdminStats:async ()=>{
        const response = await fetch(`${BASE_URL}/admin/stats`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        const responseData:ResponseModel= await response.json();
        if (!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
    },


    getFavorites:async (user_id?:string)=>{
        if(!user_id){
            user_id = Token.getUserIdFromToken() || "";
        }
        const response = await fetch(`${BASE_URL}/user/favorite/${user_id}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },

    addFavorite:async (general_id:string,type:string)=>{
        console.log(JSON.stringify({"type":type,"user_id":String(Token.getUserIdFromToken())|| ""}))

        const response = await fetch(`${BASE_URL}/user/favorite/add/${general_id}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"type":type,"user_id":String(Token.getUserIdFromToken())|| ""})
        })
    },

    deleteFavorite:async (general_id:string,type:string)=>{
        console.log(JSON.stringify({"type":type,"user_id":Token.getUserIdFromToken()|| ""}))
        const response = await fetch(`${BASE_URL}/user/favorite/delete/${general_id}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"type":type,"user_id":String(Token.getUserIdFromToken())|| ""})
        })
    },

    getCategoryId:async (name:string)=>{
        const response = await fetch(`${BASE_URL}/category/name/${name}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    getMathematicienId:async (name:string)=>{
        const response = await fetch(`${BASE_URL}/mathematicien/name/${name}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        const responseData:ResponseModel = await response.json();
        if(!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
    },
    getTypeId:async (name:string)=>{
        const response = await fetch(`${BASE_URL}/type/name/${name}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        return response.json();
    },
    rollbackConcept: async (id: string,data:RollbackConcept) => {
        const response = await fetch(`${BASE_URL}/concept/rollback/${id}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({version_number:data.version_number, field_modified:data.field_modified,username:data.username})
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la sauvegarde des modifications");
        }
    },

    getConceptHistory: async (conceptId: string) => {
        const response = await fetch(`${BASE_URL}/concept/history/${conceptId}`);
        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }
        const data = await response.json()
        logger.debug("getConceptHistory", {data});
        return data; // renvoie History[]
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
        const responseData:ResponseModel = await response.json();
        if(!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
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
        const responseData:ResponseModel = await response.json();
        if(!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
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
        const responseData:ResponseModel = await response.json();
        if(!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
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
        const responseData:ResponseModel = await response.json();
        if(!responseData.success){
            throw new Error(responseData.error as string);
        }
        return responseData.data;
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
    removeTagsFromConceptId:async (concept_id:number, tags_id:number) => {
        const response = await fetch(`${BASE_URL}/tags/remove/concept`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"concept_id":concept_id, "tag_id":tags_id})
        })
    },
    createTags:async (tags:string) => {
        const response = await fetch(`${BASE_URL}/tags/add`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"tag_name":tags})
        })
    },
    createLinkTagConcept:async (concept_id:number, tags_id:number) => {
        const response = await fetch(`${BASE_URL}/tags/add/concept`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"concept_id":concept_id, "tag_id":tags_id})
        })
    },
    getAllTagName:async()=>{
        const response = await fetch(`${BASE_URL}/tags/all`);
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