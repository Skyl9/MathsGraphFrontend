// Interface typée pour le payload utilisateur en mémoire
export interface UserPayload {
  sub: string; // username
  id: number; // user ID
  role: string; // "user" | "admin" | "moderator"
  exp: number; // timestamp d'expiration
  iat?: number; // timestamp d'émission
}

let currentUserInfo: UserPayload | null = null;

const Token = {
  saveUserInfo: (payload: UserPayload): void => {
    currentUserInfo = payload;
  },

  // Récupère l'objet utilisateur typé
  getUserInfo: (): UserPayload | null => {
    return currentUserInfo;
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
    return currentUserInfo !== null;
  },

  clearToken: (): void => {
    currentUserInfo = null;
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
  },
};

export default Token;
