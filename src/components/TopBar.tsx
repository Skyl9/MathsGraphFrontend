import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Link } from "@mui/material";
import { LogoutButton } from "./LogoutButton";
import Token from "../services/token";
import logo from '../assets/logo.svg'

export const TopBar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    // Vérifie si l'utilisateur est connecté et récupère son nom
    useEffect(() => {
        const usernameFromToken = Token.getUsernameFromToken();
        setUsername(usernameFromToken);
    }, []);

    return (
        <AppBar position="static" color="default">
            <Toolbar sx={{ justifyContent: "space-around" }}>
                <Link href={"/"} underline="none"  color={"textPrimary"}>
                <div style={{display: "flex", gap: 2, justifyContent: "flex-start", width: "100%", flexDirection:"row",alignItems:"center" }}>

                        <img src={logo} alt={"Logo"}>
                        </img>
                        <Typography>MATHGRAPH</Typography>

                </div>
                </Link>
                <div style={{justifyContent: "flex-end", display: "flex", gap: 2, alignItems: "center", width: "100%" }} >
                {username ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body1">Bonjour, <Link href={"/username/"+username}>{username}</Link></Typography>
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
                    </div>
            </Toolbar>
        </AppBar>
    );
};