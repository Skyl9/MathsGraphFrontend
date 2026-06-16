import React from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";
import MathMarkdown from "../MathMarkdown";

interface LatexEditorProps {
  text: string;
  onChange: (value: string) => void;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ text, onChange }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {/* Zone de Saisie */}
      <TextField
        label="Éditeur LaTeX / Markdown"
        multiline
        fullWidth
        minRows={6}
        maxRows={12}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        placeholder="Entrez votre texte... Utilisez $...$ pour les formules en ligne et $$...$$ pour les blocs."
        helperText="Le rendu s'affiche en temps réel ci-dessous."
      />

      {/* Zone de Prévisualisation */}
      <Typography variant="subtitle2" color="textSecondary">
        Prévisualisation :
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "background.default" : "#f9f9f9",
          minHeight: "100px",
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        <MathMarkdown content={text} />
      </Paper>
    </Box>
  );
};

export default LatexEditor;
