// Interface typée pour le payload JWT stocké en localStorage
export interface UserPayload {
    sub: string;       // username
    id: number;        // user ID
    role: string;      // "user" | "admin" | "moderator"
    exp: number;       // timestamp d'expiration
    iat?: number;      // timestamp d'émission
}

const Token = {
    saveUserInfo: (payload: UserPayload): void => {
        localStorage.setItem("user_info", JSON.stringify(payload));
    },

    // Récupère l'objet utilisateur typé
    getUserInfo: (): UserPayload | null => {
        const info = localStorage.getItem("user_info");
        if (!info) return null;
        try {
            return JSON.parse(info) as UserPayload;
        } catch {
            return null;
        }
    },

    getUsernameFromToken: (): string | null => {
        return Token.getUserInfo()?.sub ?? null;
    },

    getUserIdFromToken: (): number | null => {
        return Token.getUserInfo()?.id ?? null;
    },

    getUserRoleFromToken: (): string | null => {
        return Token.getUserInfo()?.role ?? null;
    },

    isUserConnected: (): boolean => {
        return !!localStorage.getItem("user_info");
    },

    clearToken: (): void => {
        localStorage.removeItem("user_info");
    },

    decodeToken: (token: string): UserPayload | null => {
        try {
            const payloadBase64 = token.split(".")[1];
            const payloadJson = atob(payloadBase64);
            return JSON.parse(payloadJson) as UserPayload;
        } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
            return null;
        }
    }
};

export default Token;