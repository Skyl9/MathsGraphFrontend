import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { LogoutButton } from "./LogoutButton";
import Token from "../services/token";

export const TopBar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    // Vérifie si l'utilisateur est connecté et récupère son nom
    useEffect(() => {
        const usernameFromToken = Token.getUsernameFromToken();
        setUsername(usernameFromToken);
    }, []);

    return (
        <AppBar position="static" color="default">
            <Toolbar sx={{ justifyContent: "flex-end" }}>
                {username ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body1">Bonjour, {username}</Typography>
                        <LogoutButton onLogout={() => setUsername(null)} />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button variant="outlined" href="/login">
                            Connexion
                        </Button>
                        <Button variant="contained" href="/register">
                            Inscription
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};