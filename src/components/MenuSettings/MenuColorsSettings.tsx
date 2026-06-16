import { Box, Typography, Checkbox, Divider, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

interface MenuColorsSettingsProps {
  darkMode: boolean;
  colorAxiome: string;
  colorLemme: string;
  colorTheoreme: string;
  colorReciproque: string;
  colorDefinition: string;
  colorCorollaire: string;
  colorProposition: string;
  colorPropriete: string;
  setColorAxiome: (v: string) => void;
  setColorLemme: (v: string) => void;
  setColorTheoreme: (v: string) => void;
  setColorReciproque: (v: string) => void;
  setColorDefinition: (v: string) => void;
  setColorCorollaire: (v: string) => void;
  setColorProposition: (v: string) => void;
  setColorPropriete: (v: string) => void;
  filters: { [key: string]: boolean };
  setFilters: (v: any) => void; // Using any or explicit type based on useMenuLogic
}

export default function MenuColorsSettings({
  darkMode,
  colorAxiome,
  colorLemme,
  colorTheoreme,
  colorReciproque,
  colorDefinition,
  colorCorollaire,
  colorProposition,
  colorPropriete,
  setColorAxiome,
  setColorLemme,
  setColorTheoreme,
  setColorReciproque,
  setColorDefinition,
  setColorCorollaire,
  setColorProposition,
  setColorPropriete,
  filters,
  setFilters,
}: MenuColorsSettingsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ mb: 1, fontWeight: 700, opacity: 0.8 }}
      >
        {t("menu.visibleCategories")} & Couleurs
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mb: 1.5,
        }}
      >
        {[
          {
            key: "axiome",
            label: t("categories.axioms"),
            filter: filters.axiome,
            color: colorAxiome,
            setColor: setColorAxiome,
          },
          {
            key: "théorème",
            label: t("categories.theorems"),
            filter: filters.théorème,
            color: colorTheoreme,
            setColor: setColorTheoreme,
          },
          {
            key: "lemme",
            label: t("categories.lemmas"),
            filter: filters.lemme,
            color: colorLemme,
            setColor: setColorLemme,
          },
          {
            key: "réciproque",
            label: t("categories.reciprocals"),
            filter: filters.réciproque,
            color: colorReciproque,
            setColor: setColorReciproque,
          },
          {
            key: "définition",
            label: "Définitions",
            filter: filters.définition,
            color: colorDefinition,
            setColor: setColorDefinition,
          },
          {
            key: "corollaire",
            label: "Corollaires",
            filter: filters.corollaire,
            color: colorCorollaire,
            setColor: setColorCorollaire,
          },
          {
            key: "proposition",
            label: "Propositions",
            filter: filters.proposition,
            color: colorProposition,
            setColor: setColorProposition,
          },
          {
            key: "propriété",
            label: "Propriétés",
            filter: filters.propriété,
            color: colorPropriete,
            setColor: setColorPropriete,
          },
        ].map((item) => (
          <Box
            key={item.key}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              background: darkMode
                ? alpha(theme.palette.text.primary, 0.03)
                : alpha(theme.palette.text.primary, 0.03),
              padding: "4px 8px",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: darkMode
                    ? alpha(theme.palette.divider, 0.1)
                    : alpha(theme.palette.divider, 0.1),
                },
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                size="small"
                checked={item.filter}
                onChange={(e) => setFilters({ [item.key]: e.target.checked })}
                sx={{ padding: 0 }}
              />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
            <input
              type="color"
              value={item.color}
              onChange={(e) => item.setColor(e.target.value)}
              style={{
                border: "none",
                width: 24,
                height: 24,
                cursor: "pointer",
                background: "transparent",
                padding: 0,
                borderRadius: "4px",
              }}
            />
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 1.5, opacity: 0.4 }} />
    </>
  );
}
