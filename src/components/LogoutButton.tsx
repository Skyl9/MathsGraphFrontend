import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import  Token  from "../services/token";

interface LogoutButtonProps {
    onLogout?: () => void; // Fonction optionnelle à exécuter après la déconnexion
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Token.clearToken();
        if (onLogout) {
            onLogout();
        }
        navigate("/login"); // Rediriger vers la page de connexion
    };

    return (
        <Button variant="outlined" color="error" onClick={handleLogout}>
            Déconnexion
        </Button>
    );
};