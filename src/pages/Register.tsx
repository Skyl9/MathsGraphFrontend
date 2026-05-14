import React, {useState} from 'react';
import {TextField, Button, Alert, Box, Typography, Paper} from '@mui/material';
import {nodeApi} from '../services/api';
import {useNavigate} from 'react-router-dom';

import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {TopBar} from "../components/TopBar.tsx";

const registerSchema = z.object({
    username: z.string()
        .min(3, "Le pseudo doit contenir au moins 3 caractères")
        .max(20, "Le pseudo ne peut pas dépasser 20 caractères")
        .regex(/^[a-zA-Z0-9_]+$/, "Seuls les lettres, chiffres et underscores sont autorisés"),
    email: z.string()
        .email("Adresse email invalide"),
    password: z.string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
        .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: "onBlur"
    });

    const onSubmit = async (data: RegisterFormInputs) => {
        setApiError(null);
        setApiSuccess(null);
        try {
            await nodeApi.register(data.username, data.email, data.password);
            setApiSuccess("Compte créé avec succès ! Redirection...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setApiError(err.message || "Erreur lors de l'inscription.");
        }
    };

    return (
        <>
            <TopBar></TopBar>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Paper elevation={3} sx={{p: 4, width: '100%', maxWidth: 400}}>
                    <Typography variant="h5" component="h1" gutterBottom align="center">
                        Créer un compte
                    </Typography>

                    {apiError && <Alert severity="error" sx={{mb: 2}}>{apiError}</Alert>}
                    {apiSuccess && <Alert severity="success" sx={{mb: 2}}>{apiSuccess}</Alert>}

                    <form onSubmit={handleSubmit(onSubmit)}
                          style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>

                        {/* CHAMP USERNAME */}
                        <TextField
                            label="Nom d'utilisateur"
                            {...register("username")}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />

                        {/* CHAMP EMAIL */}
                        <TextField
                            label="Email"
                            type="email"
                            {...register("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />

                        {/* CHAMP PASSWORD */}
                        <TextField
                            label="Mot de passe"
                            type="password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            sx={{mt: 2}}
                        >
                            {isSubmitting ? "Création en cours..." : "S'inscrire"}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </>
    );
};