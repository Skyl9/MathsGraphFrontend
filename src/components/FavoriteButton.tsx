import React, { useEffect, useState } from "react";
import { IconButton, CircularProgress, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { nodeApi } from "../services/api";
import Token from "../services/token";
import { Favorite } from "../types/ApiTypes/user";

export interface FavoriteButtonProps {
  itemId: string;
  itemType: string; // ex. "category", "mathematicien", "concept", etc.
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
}) => {
  const userId = Token.getUserIdFromToken();
  const [isFav, setIsFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    nodeApi
      .getFavorites()
      .then((favs: Favorite[]) => {
        const found = favs.some(
          (f) => f.id.toString() === itemId && f.category === itemType,
        );
        setIsFav(found);
      })
      .catch(() => {
        // On préfère ne pas planter l’UI, on laisse isFav = false
      })
      .finally(() => setLoading(false));
  }, [userId, itemId, itemType]);

  const handleClick = async () => {
    if (!userId) return;
    setSubmitting(true);
    try {
      if (isFav) {
        await nodeApi.deleteFavorite(itemId, itemType);
        setIsFav(false);
      } else {
        await nodeApi.addFavorite(itemId, itemType);
        setIsFav(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!userId) return null;
  if (loading) return <CircularProgress size={24} />;

  return (
    <Tooltip title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={submitting}
          color={isFav ? "error" : "default"}
        >
          {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default FavoriteButton;
