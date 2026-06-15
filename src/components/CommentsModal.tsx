import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import { nodeApi, isApiError } from "../services/api";
import Token from "../services/token";
import { Comment } from "../types/ApiTypes/comments";
import { useTranslation } from "react-i18next";

export interface FieldOption {
  value: string;
  label: string;
}

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  conceptId: string;
  fields: FieldOption[];
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  open,
  onClose,
  conceptId,
  fields,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [selectedField, setSelectedField] = useState(fields[0].value);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Récupération des infos utilisateur depuis le token
  const currentUserId = Token.getUserIdFromToken();
  const currentUserRole = Token.getUserRoleFromToken();
  const PRIVILEGED = ["admin", "moderator"];
  // Just après la déclaration de PRIVILEGED
  const isPrivileged = PRIVILEGED.includes(currentUserRole || "");
  const { t } = useTranslation();

  // Charge tous les commentaires puis on filtrera selon selectedField
  useEffect(() => {
    if (!open) return;
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const data = await nodeApi.getComments(conceptId);
        setComments(data);
      } catch (err: unknown) {
        if (isApiError(err)) {
          setError(err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(t("common.unexpected_error"));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [open, conceptId, t]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await nodeApi.postComment(
        conceptId,
        replyTo ? parseInt(String(replyTo.id), 10) : 0,
        selectedField,
        newComment,
      );
      setNewComment("");
      setReplyTo(null);
      const data = await nodeApi.getComments(conceptId);
      setComments(data);
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.unexpected_error"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await nodeApi.deleteComment(id);
      setComments((c) => c.filter((x) => String(x.id) !== id));
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.unexpected_error"));
      }
    }
  };

  // Ne conserver que les commentaires du champ sélectionné
  const visibleComments = comments.filter((c) => c.field === selectedField);

  // Construire l'arborescence et aplatir avec profondeur
  const threadedComments = React.useMemo(() => {
    type Node = Comment & { children: Node[] };
    // Map de tous les commentaires avec enfants
    const map = new Map<string, Node>();
    visibleComments.forEach((c) =>
      map.set(String(c.id), { ...c, children: [] }),
    );
    const roots: Node[] = [];
    map.forEach((node) => {
      if (node.parent_id && map.has(String(node.parent_id))) {
        map.get(String(node.parent_id))!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    // Aplatir en liste ordonnée avec profondeur
    const flatten = (
      nodes: Node[],
      depth = 0,
    ): { node: Node; depth: number }[] =>
      nodes.reduce(
        (acc, n) => {
          acc.push({ node: n, depth });
          if (n.children.length) {
            acc.push(...flatten(n.children, depth + 1));
          }
          return acc;
        },
        [] as { node: Node; depth: number }[],
      );
    return flatten(roots);
  }, [visibleComments]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("comments.title")}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {threadedComments.length ? (
              threadedComments.map(({ node: c, depth }) => (
                <ListItem
                  key={c.id}
                  sx={{ pl: depth * 4 }}
                  secondaryAction={
                    <>
                      {/* Seuls les utilisateurs connectés peuvent répondre */}
                      {currentUserId && (
                        <IconButton
                          edge="end"
                          onClick={() => setReplyTo(c)}
                          size="small"
                        >
                          <ReplyIcon fontSize="small" />
                        </IconButton>
                      )}
                      {/* Seuls les admins/modérateurs ou l'auteur peuvent supprimer */}
                      {!c.is_deleted &&
                        (isPrivileged || c.user_id === currentUserId) && (
                          <IconButton
                            edge="end"
                            onClick={() => handleDelete(String(c.id))}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                    </>
                  }
                >
                  <ListItemText
                    primary={
                      c.is_deleted
                        ? t("comments.deleted_comment")
                        : `${c.username} : ${c.content}`
                    }
                    secondary={[
                      `${t("comments.user_label")}${c.username}`,
                      c.parent_id &&
                        `${t("comments.reply_to_label")}${c.parent_id}`,
                      c.created_at && new Date(c.created_at).toLocaleString(),
                    ]
                      .filter(Boolean)
                      .join(" • ")}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary={t("comments.no_comments_field")} />
              </ListItem>
            )}
          </List>
        )}

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="field-select-label">{t("comments.field")}</InputLabel>
          <Select
            labelId="field-select-label"
            label={t("comments.field")}
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value as string)}
          >
            {fields.map((f) => (
              <MenuItem key={f.value} value={f.value}>
                {f.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Si pas connecté, on invite à se connecter */}
        {!currentUserId ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {t("comments.login_to_comment")}
          </Alert>
        ) : (
          <>
            {replyTo && (
              <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
                <Chip
                  label={t("comments.reply_to", { username: replyTo.username })}
                  onDelete={() => setReplyTo(null)}
                  color="primary"
                />
              </Stack>
            )}
            <TextField
              label={t("comments.new_comment")}
              fullWidth
              multiline
              minRows={2}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              sx={{ mt: 2 }}
            />
          </>
        )}

        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
          <Button
            variant="contained"
            onClick={handlePost}
            disabled={submitting || !newComment.trim() || !currentUserId}
          >
            {submitting ? t("comments.sending") : t("comments.send")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
