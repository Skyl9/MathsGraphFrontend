import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { nodeApi, isApiError } from '../services/api';
import {TopBar} from "../components/TopBar";
import {ReportIssueButton} from "../components/Issue";

interface ResetPasswordVerificationData {
  password: string;
  confirmPassword: string;
}

const PasswordResetVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ResetPasswordVerificationData>({
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Lien de réinitialisation invalide');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    try {
      await nodeApi.resetPassword(token, formData.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <>
        <TopBar/>
      <Container maxWidth="sm">
        <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
        >
          <Typography component="h1" variant="h5">
            Définir un nouveau mot de passe
          </Typography>

          {error && (
              <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
                {error}
              </Alert>
          )}

          {isSuccess ? (
              <Alert severity="success" sx={{ mt: 3, width: '100%' }}>
                Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
              </Alert>
          ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Nouveau mot de passe"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading || !formData.password || !formData.confirmPassword}
                >
                  {isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
                </Button>
              </Box>
          )}

        </Box>
        <ReportIssueButton/>

      </Container>
      </>
  );
};

export default PasswordResetVerification;