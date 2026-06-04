import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Token from "../services/token";
import { nodeApi } from "../services/api.ts";
import { useTranslation } from "react-i18next";

interface LogoutButtonProps {
  onLogout?: () => void; // Fonction optionnelle à exécuter après la déconnexion
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await nodeApi.logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion côté serveur :", error);
    }
    Token.clearToken();
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      {t("auth.logout")}
    </Button>
  );
};
