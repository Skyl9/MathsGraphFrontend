import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { Draft } from "../../types/ApiTypes/draft";
import { draftApi, nodeApi } from "../../services/api";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DraftDiffViewProps {
  draft: Draft;
  open: boolean;
  onClose: () => void;
}

export const DraftDiffView: React.FC<DraftDiffViewProps> = ({
  draft,
  open,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(draft.draft_data);

  const { data: conceptData } = useQuery({
    queryKey: ["concept", draft.concept_id],
    queryFn: () => nodeApi.getConcept(draft.concept_id!.toString()),
    enabled: !!draft.concept_id,
  });

  useEffect(() => {
    if (!isEditing && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [isEditing, draft.draft_data, open]);

  const publishMutation = useMutation({
    mutationFn: () => draftApi.publishDraft(draft.id),
    onSuccess: () => {
      toast.success("Brouillon publié avec succès !");
      queryClient.invalidateQueries({ queryKey: ["myDrafts"] });
      onClose();
    },
    onError: () => toast.error("Erreur lors de la publication."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => draftApi.deleteDraft(draft.id),
    onSuccess: () => {
      toast.info("Brouillon supprimé.");
      queryClient.invalidateQueries({ queryKey: ["myDrafts"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      draftApi.updateDraft(draft.id, { draft_data: editedData }),
    onSuccess: () => {
      toast.success("Brouillon mis à jour.");
      queryClient.invalidateQueries({ queryKey: ["myDrafts"] });
      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    if (!draft.concept_id) {
      // Pour les brouillons de création complète, on redirige vers le formulaire avancé
      navigate("/admin/new-content", { state: { draft } });
      onClose();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Prévisualisation du brouillon
        {conceptData && ` : ${conceptData.nom}`}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {isEditing ? "Édition en cours :" : "Contenu du brouillon :"}
        </Typography>
        {isEditing ? (
          <Box sx={{ mt: 2 }}>
            {Object.entries(editedData).map(([key, value]) => (
              <TextField
                key={key}
                label={key}
                fullWidth
                multiline
                minRows={3}
                margin="normal"
                value={
                  typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value
                }
                onChange={(e) => {
                  try {
                    const newVal =
                      typeof value === "object"
                        ? JSON.parse(e.target.value)
                        : e.target.value;
                    setEditedData({ ...editedData, [key]: newVal });
                  } catch {
                    // Ignorer les erreurs de parse pendant la frappe
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {Object.entries(draft.draft_data).map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {key}
                </Typography>
                <Box
                  sx={{ mt: 1, "& p": { m: 0 } }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      typeof value === "string"
                        ? value
                        : JSON.stringify(value, null, 2),
                    ),
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => deleteMutation.mutate()} color="error">
          Supprimer
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} color="inherit">
              Annuler l'édition
            </Button>
            <Button
              onClick={() => updateMutation.mutate()}
              color="primary"
              variant="outlined"
              disabled={updateMutation.isPending}
            >
              Sauvegarder
            </Button>
          </>
        ) : (
          <Button onClick={handleEditClick} color="info" variant="outlined">
            Modifier
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          Fermer
        </Button>
        <Button
          onClick={() => publishMutation.mutate()}
          color="primary"
          variant="contained"
          disabled={publishMutation.isPending}
        >
          {publishMutation.isPending ? "Publication..." : "Publier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
