const Token = {
  saveUserInfo: (payload: any): void => {
    localStorage.setItem("user_info", JSON.stringify(payload));
  },

  // Récupère l'objet utilisateur
  getUserInfo: (): any | null => {
    const info = localStorage.getItem("user_info");
    return info ? JSON.parse(info) : null;
  },

  getUsernameFromToken: (): string | null => {
    return Token.getUserInfo()?.sub || null;
  },

  getUserIdFromToken: (): string | null => {
    return Token.getUserInfo()?.id || null;
  },

  getUserRoleFromToken: (): string | null => {
    return Token.getUserInfo()?.role || null;
  },

  isUserConnected: (): boolean => {
    return !!localStorage.getItem("user_info");
  },

  clearToken: (): void => {
    localStorage.removeItem("user_info");
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
  }
};

export default Token;