import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  useTheme,
  Container,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Link } from "react-router-dom";

import { nodeApi } from "../services/api";
import { RecentChange } from "../types/ApiTypes/concept";
import { VisualDiff } from "../components/VisualDiff";
import { motion } from "framer-motion";

dayjs.locale("fr");

export const RecentChangesPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const {
    data: changes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recentHistory", "full"],
    queryFn: () => nodeApi.getRecentHistory(50),
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography variant="h6">
            Erreur lors de la récupération de l'historique.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        mb={6}
        textAlign="center"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography
          variant="h3"
          fontWeight={800}
          gutterBottom
          sx={{
            background: isDark
              ? "linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)"
              : "linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Historique des Modifications
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Découvrez l'évolution de la base de connaissances mathématiques, en
          toute transparence.
        </Typography>
      </Box>

      <Timeline
        position="right"
        sx={{
          p: 0,
          [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 },
        }}
      >
        {changes.map((change: RecentChange, index: number) => (
          <motion.div
            key={change.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: change.is_rollback
                      ? "warning.main"
                      : "primary.main",
                    boxShadow: `0 0 10px ${change.is_rollback ? theme.palette.warning.main : theme.palette.primary.main}40`,
                    p: 1,
                  }}
                >
                  {change.is_rollback ? <RestoreIcon /> : <EditIcon />}
                </TimelineDot>
                {index < changes.length - 1 && (
                  <TimelineConnector
                    sx={{
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  />
                )}
              </TimelineSeparator>

              <TimelineContent sx={{ py: "12px", px: { xs: 1, sm: 3 } }}>
                <Paper
                  elevation={isDark ? 0 : 2}
                  sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 4,
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "background.paper",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: isDark
                        ? "0 8px 32px 0 rgba(0, 0, 0, 0.4)"
                        : "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={3}
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: isDark ? "primary.dark" : "primary.light",
                          color: "primary.contrastText",
                          fontWeight: "bold",
                          width: 48,
                          height: 48,
                          fontSize: "1.2rem",
                        }}
                      >
                        {change.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={800}
                          sx={{ lineHeight: 1.2 }}
                        >
                          <Link
                            to={`/user/${change.username}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {change.username}
                          </Link>
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          {dayjs(change.modified_at).format(
                            "DD MMMM YYYY à HH:mm",
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign={{ xs: "left", sm: "right" }}>
                      <Typography
                        variant="overline"
                        fontWeight={700}
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5, lineHeight: 1 }}
                      >
                        Concept Modifié
                      </Typography>
                      <Link
                        to={`/concept/${change.concept_id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Chip
                          label={change.concept_nom}
                          color="secondary"
                          variant={isDark ? "outlined" : "filled"}
                          clickable
                          sx={{ fontWeight: 800, fontSize: "0.95rem", py: 2.5 }}
                        />
                      </Link>
                    </Box>
                  </Box>

                  <Box mb={1} display="flex" alignItems="center" gap={1}>
                    <Typography
                      variant="button"
                      color="text.primary"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: 1,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      {change.field_modified.toUpperCase()}
                    </Typography>
                  </Box>

                  {change.is_rollback && (
                    <Typography
                      variant="body2"
                      color="warning.main"
                      fontWeight={600}
                      mb={2}
                    >
                      ⚠️ Restauration d'une version précédente
                    </Typography>
                  )}

                  <Box mt={3}>
                    <VisualDiff
                      oldValue={change.old_value}
                      newValue={change.new_value}
                      type={
                        ["nom", "enonce", "demonstration"].includes(
                          change.field_modified,
                        )
                          ? "words"
                          : "chars"
                      }
                    />
                  </Box>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </motion.div>
        ))}
      </Timeline>
    </Container>
  );
};
