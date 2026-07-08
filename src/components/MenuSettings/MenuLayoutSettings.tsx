import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import { AutoGraph, GridOn, AccountTree, Timeline } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface MenuLayoutSettingsProps {
  currentView: string;
  setCurrentView: (v: string) => void;
  renderMode: "quality" | "performance";
  setRenderMode: (v: "quality" | "performance") => void;
  useInstancedEdges: boolean;
  setUseInstancedEdges: (v: boolean) => void;
  graphTheme: "classique" | "neon" | "focus";
  setGraphTheme: (v: "classique" | "neon" | "focus") => void;
}

export default function MenuLayoutSettings({
  currentView,
  setCurrentView,
  renderMode,
  setRenderMode,
  useInstancedEdges,
  setUseInstancedEdges,
  graphTheme,
  setGraphTheme,
}: MenuLayoutSettingsProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 700, opacity: 0.8 }}
      >
        {t("menu.displayMode")}
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="current-view-label">{t("menu.layout")}</InputLabel>
        <Select
          labelId="current-view-label"
          value={currentView}
          label={t("menu.layout")}
          onChange={(e) => setCurrentView(e.target.value)}
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="grille">
            <GridOn sx={{ mr: 1, fontSize: 18 }} /> {t("menu.grid")}
          </MenuItem>
          <MenuItem value="physique">
            <AutoGraph sx={{ mr: 1, fontSize: 18 }} /> {t("menu.physics")}
          </MenuItem>
          <MenuItem value="arbre">
            <AccountTree sx={{ mr: 1, fontSize: 18 }} /> {t("menu.tree")}
          </MenuItem>
          <MenuItem value="timeline">
            <Timeline sx={{ mr: 1, fontSize: 18 }} /> {t("menu.timeline")}
          </MenuItem>
          <MenuItem value="domaines">
            <AutoGraph sx={{ mr: 1, fontSize: 18 }} /> Domaines
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="render-mode-label">{t("menu.engine")}</InputLabel>
        <Select
          labelId="render-mode-label"
          value={renderMode}
          label={t("menu.engine")}
          onChange={(e) =>
            setRenderMode(e.target.value as "quality" | "performance")
          }
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="quality">{t("menu.quality")}</MenuItem>
          <MenuItem value="performance">{t("menu.performance")}</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="edges-mode-label">
          {t("menu.settings.edge_engine")}
        </InputLabel>
        <Select
          labelId="edges-mode-label"
          value={useInstancedEdges ? "instanced" : "standard"}
          label={t("menu.settings.edge_engine")}
          onChange={(e) => setUseInstancedEdges(e.target.value === "instanced")}
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="standard">
            {t("menu.settings.layout_standard")}
          </MenuItem>
          <MenuItem value="instanced">
            {t("menu.settings.layout_instanced")}
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="theme-select-label">{t("menu.visualTheme")}</InputLabel>
        <Select
          labelId="theme-select-label"
          value={graphTheme}
          label={t("menu.visualTheme")}
          onChange={(e) =>
            setGraphTheme(e.target.value as "classique" | "neon" | "focus")
          }
          sx={{ borderRadius: "10px" }}
        >
          <MenuItem value="classique">{t("menu.themeClassic")}</MenuItem>
          <MenuItem value="neon">{t("menu.themeNeon")}</MenuItem>
          <MenuItem value="focus">{t("menu.themeFocus")}</MenuItem>
        </Select>
      </FormControl>
      <Divider sx={{ my: 1.5, opacity: 0.4 }} />
    </>
  );
}
