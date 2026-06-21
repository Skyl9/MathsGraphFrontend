import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const getTheme = (dark: boolean) => {
  const base = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      primary: { main: dark ? "#7DD3FC" : "#0EA5E9" },
      secondary: { main: dark ? "#C4B5FD" : "#7C3AED" },
      background: {
        default: dark ? "#0B1020" : "#F7FAFC",
        paper: dark ? "#0F1428" : "#FFFFFF",
      },
      text: {
        primary: dark ? "#E6EAF2" : "#0F172A",
        secondary: dark ? "#B7C0D8" : "#475569",
      },
    },
    typography: {
      fontFamily:
        "Inter, Roboto, system-ui, -apple-system, Segoe UI, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      body1: { lineHeight: 1.7 },
      body2: { lineHeight: 1.7 },
    },
    shape: { borderRadius: 12 },
    spacing: 8, // 8px grid
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          "*:focus-visible": {
            outline: `3px solid ${dark ? "#7DD3FC" : "#0EA5E9"} !important`,
            outlineOffset: "3px",
            borderRadius: "4px",
            transition: "outline-color 0.2s ease-in-out",
          },
          '.mjx-container[jax="CHTML"][display="true"], mjx-container[jax="CHTML"][display="true"]':
            {
              overflowX: "auto",
              overflowY: "hidden",
              padding: "0.5em 0",
              margin: "1em 0 !important",
              maxWidth: "100%",
              "&::-webkit-scrollbar": { height: "6px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: dark ? "#334155" : "#CBD5E1",
                borderRadius: "4px",
              },
            },
          '.mjx-container[jax="CHTML"]:not([display="true"]), mjx-container[jax="CHTML"]:not([display="true"])':
            {
              verticalAlign: "-0.15em",
              lineHeight: 1,
            },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: "none", borderRadius: 10, fontWeight: 600 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { borderRadius: 14 } },
      },
      MuiTextField: {
        defaultProps: { size: "small", variant: "outlined" },
      },
    },
  });

  return responsiveFontSizes(base, { factor: 2.6 });
};
