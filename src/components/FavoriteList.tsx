import React from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { nodeApi } from "../services/api";
import Token from "../services/token";

interface Favorite {
  id: string | number;
  nom: string;
  category: string; // ex. "concept", "category", "mathematicien", etc.
}

interface FavoritesListProps {
  userId?: string; // si non fourni, on prend l'utilisateur courant
}

const FavoritesList: React.FC<FavoritesListProps> = ({ userId }) => {
  const uid = userId || Token.getUserIdFromToken();

  const { data: favs = [], isLoading: loading, error } = useQuery({
    queryKey: ['favorites', uid],
    queryFn: () => nodeApi.getFavorites(uid!),
    enabled: !!uid
  });

  if (!uid) {
    return <Alert severity="error">Utilisateur non connecté</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Alert severity="error">{(error as any).message}</Alert>;
  }
  if (favs.length === 0) {
    return <Alert severity="info">Aucun favori pour cet utilisateur.</Alert>;
  }

  const getPath = (fav: Favorite) => {
    switch (fav.category) {
      case "category":
        return `/category/${fav.id}`;
      case "mathematicien":
        return `/mathematicien/${fav.id}`;
      case "type":
        return `/type/${fav.id}`;
      default:
        return `/concept/${fav.id}`;
    }
  };

  return (
    <List>
      {favs.map((fav) => (
        <ListItem key={`${fav.category}-${fav.id}`} disablePadding>
          <ListItemButton component={Link} to={getPath(fav)}>
            <ListItemText
              primary={fav.nom}
              secondary={`Type : ${fav.category}`}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default FavoritesList;