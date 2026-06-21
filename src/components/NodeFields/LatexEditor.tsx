import React from "react";
import { TextField, Box, Typography, Paper, Grid } from "@mui/material";
import { alpha } from "@mui/material/styles";
import MathMarkdown from "../MathMarkdown";
import { useTranslation } from "react-i18next";

interface LatexEditorProps {
  text: string;
  onChange: (value: string) => void;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ text, onChange }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* Zone de Saisie */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Éditeur LaTeX / Markdown"
            multiline
            fullWidth
            minRows={10}
            maxRows={16}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            placeholder={t("latex_editor.placeholder")}
            helperText="Le rendu s'affiche en temps réel."
          />
        </Grid>

        {/* Zone de Prévisualisation */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Typography
            variant="subtitle2"
            color="textSecondary"
            sx={{ mb: 1, ml: 1 }}
          >
            Prévisualisation :
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.background.paper, 0.4)
                  : alpha(theme.palette.divider, 0.04),
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.divider, 0.1)
                  : alpha(theme.palette.divider, 0.2),
              borderRadius: 2,
              flexGrow: 1,
              minHeight: "250px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <MathMarkdown content={text} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LatexEditor;
