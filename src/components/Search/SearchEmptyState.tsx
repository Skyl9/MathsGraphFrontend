import { alpha } from "@mui/material/styles";
import {
  useTheme,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import { fadeInUp, getScaleFadeIn } from "../../utils/animations";

interface SearchEmptyStateProps {
  queryTerm: string;
  isDark: boolean;
  setLocalQuery: (q: string) => void;
  setSearchParams: (params: any) => void;
}

export const SearchEmptyState = ({
  queryTerm,
  isDark,
  setLocalQuery,
  setSearchParams,
}: SearchEmptyStateProps) => {
  const theme = useTheme();
  if (!queryTerm) {
    return (
      <motion.div variants={fadeInUp} initial="hidden" animate="show">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
            background: isDark
              ? alpha(theme.palette.background.paper, 0.4)
              : "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2.5,
          }}
        >
          <SearchIcon
            sx={{ fontSize: 48, color: "primary.main", opacity: 0.8 }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Que recherchez-vous aujourd'hui ?
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 450, mx: "auto", lineHeight: 1.5 }}
            >
              Saisissez un mot-clé ou un nom dans la barre de recherche
              ci-dessus pour explorer les théorèmes, les mathématiciens ou les
              catégories.
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 1,
              p: 2.5,
              borderRadius: 3,
              bgcolor: isDark
                ? alpha(theme.palette.divider, 0.02)
                : alpha(theme.palette.divider, 0.02),
              width: "100%",
              maxWidth: 450,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 1.5, color: "text.secondary" }}
            >
              Suggestions rapides de recherche :
            </Typography>
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              {[
                "Algèbre",
                "Géométrie",
                "Analyse",
                "Probabilités",
                "Théorème",
              ].map((word) => (
                <Chip
                  key={word}
                  label={word}
                  clickable
                  onClick={() => {
                    setLocalQuery(word);
                    setSearchParams({ q: word });
                  }}
                  size="small"
                  sx={{ fontWeight: 650 }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div variants={getScaleFadeIn(0)} initial="hidden" animate="show">
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 4,
          border: `1px solid ${isDark ? alpha(theme.palette.divider, 0.06) : alpha(theme.palette.divider, 0.06)}`,
          background: isDark
            ? alpha(theme.palette.background.paper, 0.4)
            : "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            p: 2,
            borderRadius: "50%",
            bgcolor: isDark
              ? alpha(theme.palette.error.main, 0.12)
              : alpha(theme.palette.error.main, 0.06),
            color: "error.main",
          }}
        >
          <SearchOffIcon sx={{ fontSize: 48 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Aucun résultat pour "{queryTerm}"
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 450, mx: "auto", lineHeight: 1.5 }}
          >
            Désolé, nous n'avons trouvé aucune fiche correspondante. Vérifiez
            l'orthographe ou essayez l'un des termes ci-dessous.
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            bgcolor: isDark
              ? alpha(theme.palette.divider, 0.02)
              : alpha(theme.palette.divider, 0.02),
            width: "100%",
            maxWidth: 450,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 1.5, color: "primary.main" }}
          >
            Suggestions populaires :
          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
            {["Pythagore", "Thalès", "Axiome", "Géométrie", "Algèbre"].map(
              (word) => (
                <Chip
                  key={word}
                  label={word}
                  clickable
                  onClick={() => {
                    setLocalQuery(word);
                    setSearchParams({ q: word });
                  }}
                  size="small"
                  sx={{ fontWeight: 650 }}
                />
              ),
            )}
          </Box>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 1 }}
        >
          <Button
            variant="contained"
            color="primary"
            href="/contribution"
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3.5,
              py: 1,
              textTransform: "none",
            }}
          >
            Contribuer au site
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setLocalQuery("");
              setSearchParams({});
            }}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              px: 3.5,
              py: 1,
              textTransform: "none",
            }}
          >
            Réinitialiser
          </Button>
        </Stack>
      </Paper>
    </motion.div>
  );
};
