import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from '@mui/material';

import { nodeApi, isApiError } from '../services/api';
import {TopBar} from "../components/TopBar";
import {ReportIssueButton} from "../components/Issue";

interface PasswordResetFormData {
  email: string;
}

const PasswordReset: React.FC = () => {
  const [formData, setFormData] = useState<PasswordResetFormData>({
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await nodeApi.requestPasswordReset(formData.email);
      setIsSubmitted(true);
      setError('');
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
          Réinitialisation du mot de passe
        </Typography>

        {isSubmitted ? (
          <Alert severity="success" sx={{ mt: 3, width: '100%' }}>
            Si un compte existe avec cette adresse email, vous recevrez bientôt un email avec les instructions pour réinitialiser votre mot de passe.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              type="email"
              disabled={isLoading}

            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formData.email}
            >
              {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
            </Button>
          </Box>
        )}
      </Box>
      <ReportIssueButton/>

    </Container>
      </>
  );
};

export default PasswordReset;