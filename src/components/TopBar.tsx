import React, {useContext, useEffect, useState} from "react";
import {AppBar, Toolbar, Typography, Button, Box, Link, IconButton, useTheme} from "@mui/material";
import {LogoutButton} from "./LogoutButton";
import Token from "../services/token";
import logo from '../assets/logo.svg'
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icône Lune
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Icône Soleil
import {ColorModeContext} from "../App.tsx";

export const TopBar: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    // Vérifie si l'utilisateur est connecté et récupère son nom
    useEffect(() => {
        const usernameFromToken = Token.getUsernameFromToken();
        setUsername(usernameFromToken);
    }, []);


    return (
        <AppBar position="static" color="default">
            <Toolbar sx={{justifyContent: "space-around"}}>
                <div style={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "flex-start",
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center"
                }}>
                    <div>
                    <Link href={"/"} underline="none" color={"textPrimary"}>

                        <img src={logo} alt={"Logo"}>
                        </img>
                        <Typography>MATHGRAPH</Typography>
                    </Link>
                    </div>

                    <IconButton sx={{ml: 1}} onClick={colorMode.toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                </div>
                <div style={{justifyContent: "flex-end", display: "flex", gap: 2, alignItems: "center", width: "100%"}}>
                    {username ? (
                        <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
                            <Typography variant="body1">Bonjour, <Link href={"/username/" + username}>{username}</Link></Typography>
                            <LogoutButton onLogout={() => setUsername(null)}/>
                        </Box>
                    ) : (
                        <Box sx={{display: "flex", gap: 2}}>
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