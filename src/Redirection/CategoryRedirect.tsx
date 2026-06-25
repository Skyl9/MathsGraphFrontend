import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress, Container, Typography } from "@mui/material";
import { nodeApi } from "../services/api";
import { CategoryName } from "../types/ApiTypes/category";

export const CategoryRedirect = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryName) {
      navigate("/404", { replace: true });
      return;
    }

    const fetchAndRedirect = async () => {
      try {
        const data: CategoryName = await nodeApi.getCategoryId(categoryName);
        // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
        navigate(`/category/${data.id}`, { replace: true });
      } catch (err) {
        console.error(err);
        navigate("/404", { replace: true });
      }
    };

    fetchAndRedirect();
  }, [categoryName, navigate]);

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>PLACEHOLDER_REDIRECT</Typography>
    </Container>
  );
};
