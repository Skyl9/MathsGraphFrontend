import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Typography, Alert } from '@mui/material';
import { nodeApi } from '../services/api';

const UserRedirect: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserIdAndRedirect = async () => {
      try {
        if (!username) {
          setError('Nom d\'utilisateur manquant');
          return;
        }
        const userId = await nodeApi.getUserIdByUsername(username);
        navigate(`/user/${userId}`, { replace: true });
      } catch (err) {
        setError("L'utilisateur n'a pas été trouvé");
      }
    };

    fetchUserIdAndRedirect();
  }, [username, navigate]);

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body1">
            Retournez à la {' '}
            <span
              onClick={() => navigate('/')}
              style={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
            >
              page d'accueil
            </span>
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="body1">
          Redirection en cours...
        </Typography>
      </Box>
    </Container>
  );
};

export default UserRedirect;