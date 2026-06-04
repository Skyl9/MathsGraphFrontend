import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  Button,
  Card,
  CardContent,
  TextField,
  Grid,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { MathTimelineData, nodeApi } from "../services/api";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const formatYear = (dateString: string | undefined): string => {
  if (!dateString) return "Aujourd'hui";
  // Les dates avant JC commencent par un -, ex: "-0300-01-01"
  const match = dateString.match(/^(-?)(\d+)-/);
  if (match) {
    const isBCE = match[1] === "-";
    const year = parseInt(match[2], 10);
    return isBCE ? `${year} av. J.-C.` : `${year}`;
  }
  // Fallback if the format is unexpected
  return dateString.substring(0, 4);
};

const getYearFromDate = (dateString?: string): number | null => {
  if (!dateString) return null;
  const match = dateString.match(/^(-?)(\d+)-/);
  if (match) {
    const isBCE = match[1] === "-";
    const year = parseInt(match[2], 10);
    return isBCE ? -year : year;
  }
  return null;
};

export const MathematicianTimeline: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    data: mathematicians,
    isLoading,
    error,
  } = useQuery<MathTimelineData[]>({
    queryKey: ["mathematicians-timeline"],
    queryFn: async () => {
      const result = await nodeApi.getMathematiciensTimeline();
      return result as MathTimelineData[];
    },
  });

  const [searchText, setSearchText] = useState("");
  const [searchStartYear, setSearchStartYear] = useState("");
  const [searchEndYear, setSearchEndYear] = useState("");

  const filteredMathematicians = useMemo(() => {
    if (!mathematicians) return [];
    let filtered = mathematicians;

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.nom.toLowerCase().includes(lowerSearch) ||
          (m.biographie && m.biographie.toLowerCase().includes(lowerSearch)) ||
          (m.epoque && m.epoque.toLowerCase().includes(lowerSearch)),
      );
    }

    if (
      (searchStartYear &&
        searchStartYear.trim() !== "" &&
        !isNaN(Number(searchStartYear))) ||
      (searchEndYear &&
        searchEndYear.trim() !== "" &&
        !isNaN(Number(searchEndYear)))
    ) {
      const startSearch =
        searchStartYear &&
        searchStartYear.trim() !== "" &&
        !isNaN(Number(searchStartYear))
          ? parseInt(searchStartYear, 10)
          : -9999;
      const endSearch =
        searchEndYear &&
        searchEndYear.trim() !== "" &&
        !isNaN(Number(searchEndYear))
          ? parseInt(searchEndYear, 10)
          : 9999;

      filtered = filtered.filter((m) => {
        const birthYear = getYearFromDate(m.date_naissance);
        const deathYear = getYearFromDate(m.date_deces);

        if (birthYear === null) return false;

        // Si l'année de décès est inconnue, on estime une vie de 80 ans ou jusqu'à aujourd'hui
        const endYear =
          deathYear !== null
            ? deathYear
            : birthYear < 1900
              ? birthYear + 80
              : new Date().getFullYear();

        // Intersection des deux périodes: [birthYear, endYear] et [startSearch, endSearch]
        return birthYear <= endSearch && endYear >= startSearch;
      });
    }

    return filtered;
  }, [mathematicians, searchText, searchStartYear, searchEndYear]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error">
        Erreur lors du chargement de la chronologie.
      </Typography>
    );

  return (
    <Box sx={{ width: "100%", height: "100%", p: 2, overflowY: "auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ mb: 4, fontWeight: 700 }}
      >
        Chronologie des Mathématiciens
      </Typography>

      <Box sx={{ mb: 5, maxWidth: 900, mx: "auto" }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Recherche par nom ou mots-clés..."
              variant="outlined"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Année Min (ex: -300)"
              type="number"
              variant="outlined"
              value={searchStartYear}
              onChange={(e) => setSearchStartYear(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Année Max (ex: 1800)"
              type="number"
              variant="outlined"
              value={searchEndYear}
              onChange={(e) => setSearchEndYear(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {!mathematicians || mathematicians.length === 0 ? (
        <Typography align="center">Aucune date disponible.</Typography>
      ) : filteredMathematicians.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          Aucun mathématicien ne correspond à ces critères.
        </Typography>
      ) : (
        <Timeline position="alternate">
          {filteredMathematicians.map((math, index) => (
            <TimelineItem key={math.id}>
              <TimelineOppositeContent
                sx={{ m: "auto 0" }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                <Typography variant="h6" color="text.primary" fontWeight="bold">
                  {formatYear(math.date_naissance)}
                </Typography>
                {math.epoque && (
                  <Typography variant="caption" color="text.secondary">
                    {math.epoque}
                  </Typography>
                )}
              </TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineConnector
                  sx={{ bgcolor: index === 0 ? "transparent" : "primary.main" }}
                />
                <TimelineDot
                  color="primary"
                  variant={index % 2 === 0 ? "filled" : "outlined"}
                />
                <TimelineConnector
                  sx={{
                    bgcolor:
                      index === mathematicians.length - 1
                        ? "transparent"
                        : "primary.main",
                  }}
                />
              </TimelineSeparator>

              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Card
                  elevation={theme.palette.mode === "dark" ? 2 : 1}
                  sx={{
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                    textAlign: "left", // Pour s'assurer que le texte de la carte reste bien aligné à gauche
                  }}
                >
                  <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 800,
                        color: theme.palette.primary.main,
                        mb: 0.5,
                      }}
                    >
                      {math.nom}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        mb: 1.5,
                      }}
                    >
                      {formatYear(math.date_naissance)} -{" "}
                      {formatYear(math.date_deces)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: theme.palette.text.primary,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {math.biographie ||
                        "Aucune biographie disponible pour ce mathématicien."}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/mathematicien/${math.id}`)}
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      En savoir plus
                    </Button>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Box>
  );
};
