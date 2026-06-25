import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { nodeApi } from "../services/api";

const UserRedirect = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIdAndRedirect = async () => {
      try {
        if (!username) {
          navigate("/404", { replace: true });
          return;
        }
        const userId = await nodeApi.getUserIdByUsername(username);
        navigate(`/user/${userId.id}`, { replace: true });
      } catch {
        navigate("/404", { replace: true });
      }
    };

    fetchUserIdAndRedirect();
  }, [username, navigate]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1">PLACEHOLDER_REDIRECT</Typography>
      </Box>
    </Container>
  );
};

export default UserRedirect;
