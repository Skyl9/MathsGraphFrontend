import React, { useState } from "react";
import {TextField, Button, Typography, Box, Alert, Link, Snackbar} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import {nodeApi} from "../services/api";

export const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await nodeApi.register(username, email, password);

            setSuccess(true);
            setSnackbarMessage("Inscription réussie ! Redirection vers la connexion...");
            setOpenSnackbar(true);

            // Redirection vers la page login après 3 secondes (optionnel)
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (e:any) {
            const backendError = e.response?.data?.error|| e.message || "Une erreur inattendue est survenue.";
            setSuccess(false);
            setSnackbarMessage(backendError);
            setOpenSnackbar(true);
        }
    };

    return (
        <>
            <TopBar/>
        <Box
            component="form"
            onSubmit={handleRegister}
            sx={{
                maxWidth: 400,
                margin: "auto",
                mt: 8,
                px: 3,
                py: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
            }}
        >
            <Typography variant="h4" mb={2} align="center">
                Inscription
            </Typography>

            <TextField
                label="Nom d'utilisateur"
                type="text"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />

            <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <TextField
                label="Mot de passe"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.5 }}
            >
                S'inscrire
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Déjà un compte ?{" "}
                <Link href="/login" underline="hover">
                    Se connecter
                </Link>
            </Typography>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={success ? "success" : "error"}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
        </>
    );
};
