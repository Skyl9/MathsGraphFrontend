import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/TopBar";
import { nodeApi } from "../services/api";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    password: z.string().min(1, "Le mot de passe est requis")
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur"
    });

    const onSubmit = async (data: LoginFormInputs) => {
        setApiError(null);
        try {
            const formData = new URLSearchParams();
            formData.append("username", data.username);
            formData.append("password", data.password);

            const responseData = await nodeApi.getToken(formData);
            localStorage.setItem("token", responseData.access_token);

            navigate("/");
        } catch (e: any) {
            setApiError(e.message || "Une erreur est survenue. Veuillez réessayer.");
            console.error(e);
        }
    };

    return (
        <>
            <TopBar/>
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    maxWidth: 400,
                    margin: "auto",
                    mt: 8,
                    px: 3,
                    py: 4,
                    boxShadow: 3,
                    borderRadius: 2,

                    bgcolor: "background.paper",
                }}
            >
                <Typography variant="h4" mb={2} align="center">
                    Connexion
                </Typography>

                {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

                <TextField
                    label="Nom d'utilisateur"
                    type="text"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                />

                <TextField
                    label="Mot de passe"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Pas encore de compte ?{" "}
                    <Link href="/register" underline="hover">
                        S'inscrire
                    </Link>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    <Link href="/reset-password" underline="hover">
                        Mot de passe oublié ?
                    </Link>
                </Typography>
            </Box>
        </>
    );
};