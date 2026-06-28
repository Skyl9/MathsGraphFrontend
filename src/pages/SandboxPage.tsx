import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Grid,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LatexEditor from "../components/NodeFields/LatexEditor";
import MathMarkdown from "../components/MathMarkdown";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";

const SandboxPage: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Code LaTeX copié dans le presse-papiers !");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight={800} gutterBottom>
          Espace Bac à Sable
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Entraînez-vous à rédiger du texte riche et des équations mathématiques
          en LaTeX en toute sécurité. Rien de ce qui est écrit ici ne sera
          sauvegardé sur le serveur.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6" fontWeight={700}>
                Éditeur
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                disabled={!content.trim()}
                size="small"
              >
                Copier
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <LatexEditor text={content} onChange={setContent} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              height: "100%",
              minHeight: "400px",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Rendu en direct
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                overflowY: "auto",
                p: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "background.default"
                    : "grey.50",
                borderRadius: 2,
                minHeight: "300px",
              }}
            >
              {content.trim() ? (
                <MathMarkdown content={content} />
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontStyle="italic"
                >
                  Votre rendu apparaîtra ici...
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SandboxPage;
