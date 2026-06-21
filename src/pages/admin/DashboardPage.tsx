import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Grid,
  useTheme,
  Button,
  Stack,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from "@mui/material";
import { nodeApi } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import {
  AdminStats,
  ApiAnalytics,
  RecentActivityItem,
} from "../../types/ApiTypes/admin";
import { useNavigate } from "react-router-dom";

// Icônes
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FunctionsIcon from "@mui/icons-material/Functions";
import CategoryIcon from "@mui/icons-material/Category";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import ArticleIcon from "@mui/icons-material/Article";

// Charts
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";

const DashboardPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();

  // 1. Récupération des analytics en temps réel (rafraîchi toutes les 10s)
  const { data: analytics, isLoading: loadingAnalytics } =
    useQuery<ApiAnalytics>({
      queryKey: ["apiAnalytics"],
      queryFn: () => nodeApi.getApiAnalytics(),
      refetchInterval: 10000,
    });

  // 2. Récupération des stats générales
  const {
    data: stats,
    isLoading: loadingStats,
    error,
  } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: () => nodeApi.getAdminStats(),
  });

  // 3. Activité Récente
  const { data: recentActivity, isLoading: loadingActivity } = useQuery<
    RecentActivityItem[]
  >({
    queryKey: ["recentActivity"],
    queryFn: () => nodeApi.getRecentActivity(8),
    refetchInterval: 10000,
  });

  if (loadingStats || loadingAnalytics || loadingActivity) {
    return (
      <Box sx={{ p: 1 }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rounded" width={150} height={36} />
        </Stack>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={i}>
              <Skeleton
                variant="rounded"
                height={140}
                sx={{ borderRadius: 4 }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton
              variant="rounded"
              height={300}
              sx={{ borderRadius: 4, mb: 4 }}
            />
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={700} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : "Une erreur est survenue"}
      </Alert>
    );
  }

  if (!stats || !analytics) return null;

  // Métriques associées à des icônes et couleurs adaptées
  const cards = [
    {
      label: "Utilisateurs",
      value: stats.users,
      growth: stats.users_growth,
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      color: "#0ea5e9",
      bgColor: isDark ? "rgba(14, 165, 233, 0.15)" : "rgba(14, 165, 233, 0.08)",
    },
    {
      label: "Favoris",
      value: stats.favorites,
      icon: <FavoriteIcon sx={{ fontSize: 24 }} />,
      color: "#f43f5e",
      bgColor: isDark ? "rgba(244, 63, 94, 0.15)" : "rgba(244, 63, 94, 0.08)",
    },
    {
      label: "Concepts",
      value: stats.concepts,
      growth: stats.concepts_growth,
      icon: <FunctionsIcon sx={{ fontSize: 24 }} />,
      color: "#8b5cf6",
      bgColor: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.08)",
    },
    {
      label: "Catégories",
      value: stats.categories,
      icon: <CategoryIcon sx={{ fontSize: 24 }} />,
      color: "#f97316",
      bgColor: isDark ? "rgba(249, 115, 22, 0.15)" : "rgba(249, 115, 22, 0.08)",
    },
    {
      label: "Appels API (Aujourd'hui)",
      value: analytics.daily_hits || "0",
      icon: <SpeedIcon sx={{ fontSize: 24 }} />,
      color: "#10b981",
      bgColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)",
    },
  ];

  // Data pour le PieChart
  const pieData = [
    { id: 0, value: stats.concepts, label: "Concepts", color: "#8b5cf6" },
    { id: 1, value: stats.categories, label: "Catégories", color: "#f97316" },
    {
      id: 2,
      value: stats.mathematicien,
      label: "Mathématiciens",
      color: "#0ea5e9",
    },
  ];

  // Data pour le LineChart
  const lineX =
    analytics.weekly_hits?.map((h) =>
      new Date(h.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    ) || [];
  const lineY = analytics.weekly_hits?.map((h) => h.hits) || [];

  const maxHits =
    analytics.top_routes?.reduce(
      (max, r) => (r.total_hits > max ? r.total_hits : max),
      1,
    ) || 1;

  return (
    <Box sx={{ p: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
        >
          Tableau de Bord Administration
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/contents/new")}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Nouveau Concept
          </Button>
        </Stack>
      </Stack>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((c, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                borderRadius: 4,
                background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                transition: "transform 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  borderColor: c.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor: c.bgColor,
                      color: c.color,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {c.icon}
                  </Box>
                  {c.growth !== undefined && (
                    <Chip
                      icon={
                        c.growth >= 0 ? (
                          <TrendingUpIcon fontSize="small" />
                        ) : (
                          <TrendingDownIcon fontSize="small" />
                        )
                      }
                      label={`${c.growth > 0 ? "+" : ""}${c.growth} (30j)`}
                      color={c.growth >= 0 ? "success" : "error"}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700, borderRadius: 1.5 }}
                    />
                  )}
                </Stack>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: isDark ? "#ffffff" : "#0f172a",
                    mb: 0.5,
                  }}
                >
                  {c.value}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  {c.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Layout Principal : Gauche (Charts + Table) / Droite (Activity) */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Graphiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Trafic API (7 jours)
                </Typography>
                {lineX.length > 0 ? (
                  <LineChart
                    xAxis={[{ scaleType: "point", data: lineX }]}
                    series={[
                      {
                        data: lineY,
                        color: "#10b981",
                        area: true,
                        showMark: true,
                      },
                    ]}
                    height={250}
                    margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Données insuffisantes
                  </Typography>
                )}
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
                  height: "100%",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Répartition des Contenus
                </Typography>
                <PieChart
                  series={[
                    {
                      data: pieData,
                      innerRadius: 40,
                      outerRadius: 100,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    },
                  ]}
                  height={250}
                  margin={{ right: 150 }}
                />
              </Paper>
            </Grid>
          </Grid>

          {/* Tableau des Analytics */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2.5 }}>
            Top des Routes de l'API
          </Typography>

          <Paper
            elevation={0}
            sx={{
              overflow: "hidden",
              borderRadius: 4,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
            }}
          >
            <Table>
              <TableHead
                sx={{
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.01)",
                }}
              >
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Méthode</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Appels
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.top_routes?.map((route, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={route.method}
                        color={
                          route.method === "GET"
                            ? "success"
                            : route.method === "POST"
                              ? "info"
                              : "warning"
                        }
                        size="small"
                        sx={{ fontWeight: 800, borderRadius: 1.5 }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontFamily: "monospace", fontWeight: 500 }}
                    >
                      {route.endpoint}
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {route.total_hits}
                        </Typography>
                        <Box
                          sx={{
                            width: 60,
                            height: 6,
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.06)",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(route.total_hits / maxHits) * 100}%`,
                              height: "100%",
                              bgcolor: "primary.main",
                              borderRadius: 3,
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Barre latérale : Activité Récente */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              background: isDark ? "rgba(15, 20, 40, 0.4)" : "#ffffff",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <HistoryIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Activité Récente
              </Typography>
            </Stack>

            <List disablePadding>
              {recentActivity?.map((item, index) => {
                const isUser = item.type === "user";
                return (
                  <React.Fragment key={`${item.type}-${item.id}`}>
                    <ListItem
                      alignItems="flex-start"
                      disableGutters
                      sx={{ py: 2 }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: isUser ? "info.main" : "secondary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          {isUser ? (
                            <PeopleIcon fontSize="small" />
                          ) : (
                            <ArticleIcon fontSize="small" />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {isUser
                              ? "Nouvel utilisateur inscrit"
                              : "Nouveau contenu ajouté"}
                          </Typography>
                        }
                        secondary={
                          <Box
                            component="span"
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                              sx={{ fontWeight: 600 }}
                            >
                              {item.nom}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(item.date).toLocaleDateString("fr-FR")}{" "}
                              à{" "}
                              {new Date(item.date).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && (
                      <Divider component="li" />
                    )}
                  </React.Fragment>
                );
              })}
              {!recentActivity?.length && (
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ fontStyle: "italic", textAlign: "center", py: 4 }}
                >
                  Aucune activité récente.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
