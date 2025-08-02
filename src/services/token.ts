const Token = {
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
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
  getUsernameFromToken: (): string | null => {
    const token = Token.getToken();
    if (!token) return null;
    const payload = Token.decodeToken(token);
    return payload?.sub || null;
  },
  /**
   * Récupère l'ID utilisateur (champ "id") depuis le JWT
   */
  getUserIdFromToken: (): string | null => {
    const token = Token.getToken();
    if (!token) return null;
    const payload = Token.decodeToken(token);
    return payload?.id || null;
  },
  /**
   * Récupère le rôle (champ "role") depuis le JWT
   */
  getUserRoleFromToken: (): string | null => {
    const token = Token.getToken();
    if (!token) return null;
    const payload = Token.decodeToken(token);
    return payload?.role || null;
  },
  clearToken: (): void => {
    localStorage.removeItem("token");
  }
};

export default Token;