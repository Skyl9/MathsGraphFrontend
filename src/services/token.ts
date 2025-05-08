/**
 * Module Token : Fournit toutes les fonctionnalités liées à l'utilisation des tokens.
 */
const Token = {
    /**
     * Récupère le token du localStorage.
     */
    getToken: (): string | null => {
        return localStorage.getItem("token");
    },

    /**
     * Décodage du payload d'un JWT pour extraire les informations utilisateur.
     * @param token Le token JWT
     * @returns Le payload décodé ou null s'il y a une erreur
     */
    decodeToken: (token: string): any | null => {
        try {
            const payloadBase64 = token.split(".")[1];
            const payloadJson = atob(payloadBase64);
            return JSON.parse(payloadJson);
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
            return null;
        }
    },

    /**
     * Récupère le nom d'utilisateur (sub) à partir du token.
     * @returns Le nom d'utilisateur ou null si le token est absent/invalide
     */
    getUsernameFromToken: (): string | null => {
        const token = Token.getToken();
        if (!token) {
            return null;
        }
        const payload = Token.decodeToken(token);
        return payload?.sub || null; // Retourne le champ "sub" s'il existe
    },

    /**
     * Supprime le token du localStorage.
     */
    clearToken: (): void => {
        localStorage.removeItem("token");
    }
};

export default Token;