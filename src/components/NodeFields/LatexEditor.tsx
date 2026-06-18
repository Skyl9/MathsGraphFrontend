import React from "react";
import { TextField, Box, Typography, Paper } from "@mui/material";
import MathMarkdown from "../MathMarkdown";
import { useTranslation } from "react-i18next";

interface LatexEditorProps {
  text: string;
  onChange: (value: string) => void;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ text, onChange }) => {
  const { t } = useTranslation();
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
        placeholder={t("latex_editor.placeholder")}
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
