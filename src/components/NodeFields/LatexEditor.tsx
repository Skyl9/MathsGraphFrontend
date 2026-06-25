import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { alpha, type SxProps, type Theme } from "@mui/material/styles";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import MathMarkdown from "../MathMarkdown";
import { useTranslation } from "react-i18next";

interface LatexEditorProps {
  text: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const LatexEditor: React.FC<LatexEditorProps> = ({ text, onChange, error }) => {
  const { t } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const containerSx: SxProps<Theme> = isFullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "background.paper",
        p: 4,
        overflow: "auto",
      }
    : { mt: 2, position: "relative" };

  return (
    <Box sx={containerSx}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 1,
          position: isFullscreen ? "absolute" : "relative",
          right: isFullscreen ? 16 : 0,
          top: isFullscreen ? 16 : 0,
          zIndex: 10000,
        }}
      >
        <IconButton onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>
      <Grid
        container
        spacing={3}
        sx={isFullscreen ? { height: "calc(100% - 48px)", mt: 2 } : {}}
      >
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={isFullscreen ? { height: "100%" } : {}}
        >
          <TextField
            label={t("latex_editor.label", "Éditeur LaTeX / Markdown")}
            multiline
            fullWidth
            sx={
              isFullscreen
                ? {
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                      alignItems: "flex-start",
                      overflow: "auto",
                    },
                  }
                : {}
            }
            minRows={isFullscreen ? undefined : 10}
            maxRows={isFullscreen ? undefined : 16}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            variant="outlined"
            placeholder={t("latex_editor.placeholder")}
            error={!!error}
            helperText={error || "Le rendu s'affiche en temps réel."}
          />
        </Grid>

        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: isFullscreen ? "100%" : "auto",
          }}
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
              minHeight: isFullscreen ? "auto" : "250px",
              maxHeight: isFullscreen ? "100%" : "400px",
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
