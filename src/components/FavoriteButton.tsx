import React, { useEffect, useState } from "react";
import {
  IconButton,
  CircularProgress,
  Tooltip,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { nodeApi } from "../services/api";
import Token from "../services/token";
import { Favorite } from "../types/ApiTypes/user";
import { useTranslation } from "react-i18next";

export interface FavoriteButtonProps {
  itemId: string;
  itemType: string; // ex. "category", "mathematicien", "concept", etc.
  variant?: "icon" | "menuItem";
  onClickCallback?: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
  variant = "icon",
  onClickCallback,
}) => {
  const userId = Token.getUserIdFromToken();
  const { t } = useTranslation();
  const [isFav, setIsFav] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notify, setNotify] = useState(false);

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

  const handleAddWithNotify = async () => {
    setSubmitting(true);
    setDialogOpen(false);
    try {
      await nodeApi.addFavorite(itemId, itemType, notify);
      setIsFav(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      if (onClickCallback) onClickCallback();
    }
  };

  const handleClick = async () => {
    if (!userId) return;
    if (isFav) {
      setSubmitting(true);
      try {
        await nodeApi.deleteFavorite(itemId, itemType);
        setIsFav(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
        if (onClickCallback) onClickCallback();
      }
    } else {
      setNotify(false);
      setDialogOpen(true);
    }
  };

  if (!userId) return null;
  if (loading) return <CircularProgress size={24} />;

  if (variant === "menuItem") {
    return (
      <MenuItem onClick={handleClick} disabled={submitting}>
        <ListItemIcon>
          {isFav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </ListItemIcon>
        {isFav ? t("favorite_button.remove") : t("favorite_button.add")}
      </MenuItem>
    );
  }

  return (
    <>
      <Tooltip
        title={isFav ? t("favorite_button.remove") : t("favorite_button.add")}
      >
        <span>
          <IconButton
            aria-label={
              isFav ? t("favorite_button.remove") : t("favorite_button.add")
            }
            onClick={handleClick}
            disabled={submitting}
            color={isFav ? "error" : "default"}
          >
            {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Ajouter aux favoris</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
              />
            }
            label="M'alerter en cas de modification"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Annuler</Button>
          <Button
            onClick={handleAddWithNotify}
            variant="contained"
            disabled={submitting}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FavoriteButton;
