import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert
} from "@mui/material";
import { Link } from "react-router-dom";
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
  const [favs, setFavs] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let uid: string | null = null;
  if (userId){
    uid = userId
    console.log(uid)
  }
  else {
    uid = Token.getUserIdFromToken();
  }
  useEffect(() => {
    if (!uid) {
      setError("Utilisateur non connecté");
      setLoading(false);
      return;
    }
    nodeApi
      .getFavorites(uid)
      .then((data: Favorite[]) => setFavs(data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [uid]);

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
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