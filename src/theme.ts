import { createTheme, responsiveFontSizes, alpha } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    glassmorphism: {
      main: any;
      card: any;
      pill: any;
    };
    gradients: {
      background: {
        neon: string;
        default: string;
      };
      text: {
        primary: string;
      };
    };
  }
  interface ThemeOptions {
    glassmorphism?: {
      main?: any;
      card?: any;
      pill?: any;
    };
    gradients?: {
      background?: {
        neon?: string;
        default?: string;
      };
      text?: {
        primary?: string;
      };
    };
  }
}

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
    glassmorphism: {
      main: {
        backgroundColor: dark ? alpha("#0F1428", 0.75) : alpha("#FFFFFF", 0.75),
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${dark ? alpha("#FFFFFF", 0.08) : alpha("#FFFFFF", 0.5)}`,
        boxShadow: dark
          ? "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
          : "0 8px 32px 0 rgba(31, 38, 135, 0.05)",
      },
      card: {
        backgroundColor: dark ? alpha("#0B1020", 0.85) : alpha("#FFFFFF", 0.85),
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${dark ? alpha("#FFFFFF", 0.1) : alpha("#FFFFFF", 0.6)}`,
        boxShadow: dark
          ? "0 4px 16px 0 rgba(0, 0, 0, 0.2)"
          : "0 4px 16px 0 rgba(31, 38, 135, 0.03)",
      },
      pill: {
        backgroundColor: dark ? alpha("#0F1428", 0.8) : alpha("#FFFFFF", 0.8),
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${dark ? alpha("#FFFFFF", 0.12) : alpha("#FFFFFF", 0.8)}`,
        boxShadow: dark
          ? "0 2px 8px 0 rgba(0, 0, 0, 0.25)"
          : "0 2px 8px 0 rgba(31, 38, 135, 0.04)",
      },
    },
    gradients: {
      background: {
        neon: "radial-gradient(circle at center, #0B0B1E 0%, #03030A 100%)",
        default: dark
          ? "radial-gradient(circle at center, #0F172A 0%, #020617 100%)"
          : "radial-gradient(circle at center, #F8FAFC 0%, #E2E8F0 100%)",
      },
      text: {
        primary: dark
          ? "linear-gradient(90deg, #7DD3FC 0%, #C4B5FD 100%)"
          : "linear-gradient(90deg, #0EA5E9 0%, #7C3AED 100%)",
      },
    },
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
