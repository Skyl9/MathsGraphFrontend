import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { RecentChange } from "../types/ApiTypes/concept"; // On réutilise l'interface existante
import { useTranslation } from "react-i18next";

dayjs.extend(relativeTime);
dayjs.locale("fr");

interface UserContributionsProps {
  userId: string;
}

const UserContributions: React.FC<UserContributionsProps> = ({ userId }) => {
  const { t } = useTranslation();
  const {
    data: contributions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["userContributions", userId],
    queryFn: () => nodeApi.getUserContributions(userId),
    enabled: !!userId,
  });

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={30} />
      </Box>
    );
  if (error)
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : String(error)}
      </Alert>
    );
  if (contributions.length === 0)
    return (
      <Alert severity="info">{t("user_contributions.no_contributions")}</Alert>
    );

  return (
    <Paper
      elevation={2}
      sx={{ p: 2, mt: 2, maxHeight: "400px", overflowY: "auto" }}
    >
      <Typography variant="h6" gutterBottom>
        {t("user_contributions.title")}
      </Typography>
      <List>
        {contributions.map((change: RecentChange) => (
          <ListItem key={change.id} divider sx={{ px: 1 }}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography
                    variant="body2"
                    component="span"
                    color="textSecondary"
                  >
                    a{" "}
                    {change.is_rollback
                      ? t("user_contributions.restored")
                      : t("user_contributions.modified")}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    component="span"
                    color="primary"
                  >
                    <Link
                      to={`/concept/${change.concept_id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {change.concept_nom}
                    </Link>
                  </Typography>
                </Box>
              }
              secondary={
                <Box mt={0.5} display="flex" alignItems="center" gap={1}>
                  <Chip
                    size="small"
                    label={change.field_modified}
                    color={change.is_rollback ? "warning" : "default"}
                    variant="outlined"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    • {dayjs(change.modified_at).format("DD MMM YYYY à HH:mm")}
                  </Typography>
                </Box>
              }
              secondaryTypographyProps={{ component: "div" }}
              primaryTypographyProps={{ component: "div" }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default UserContributions;
