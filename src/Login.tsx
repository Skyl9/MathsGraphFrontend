import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Activation du chargement
        const backendLink = process.env.REACT_APP_BACKEND_LINK || "";

        try {
            // Utiliser FormData pour envoyer les données sous forme de `application/x-www-form-urlencoded`
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch(backendLink + "/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                setError("Identifiants invalides. Veuillez réessayer.");
                return;
            }

            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            setError(null); // Aucun message d'erreur
            navigate("/"); // Redirection après connexion
        } catch (e) {
            setError("Une erreur est survenue. Veuillez réessayer.");
            console.error(e);
        } finally {
            setLoading(false); // Désactivation du chargement
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleLogin}
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
                Connexion
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                disabled={loading} // Désactiver le bouton si chargement
            >
                {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Pas encore de compte ?{" "}
                <Link href="/register" underline="hover">
                    S'inscrire
                </Link>
            </Typography>
        </Box>
    );
};