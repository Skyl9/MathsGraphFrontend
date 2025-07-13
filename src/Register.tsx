import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TopBar } from "./components/TopBar";

export const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const backendLink = process.env.REACT_APP_BACKEND_LINK || "";

        try {
            const response = await fetch(backendLink + "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                setError("Impossible de créer l'utilisateur");
                return;
            }

            setError(null);
            setSuccess(true);

            // Redirection vers la page login après 3 secondes (optionnel)
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (e) {
            setError("Une erreur est survenue.");
            console.error(e);
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

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Compte créé avec succès ! Redirection vers la page de connexion...
                </Alert>
            )}

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
        </Box>
        </>
    );
};