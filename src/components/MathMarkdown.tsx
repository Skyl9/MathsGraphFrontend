import { Component, ErrorInfo, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface MathMarkdownProps {
  content: string | number | null | undefined;
}

const mathSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div || []),
      ["className", "math", "math-display"],
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      ["className", "math", "math-inline"],
    ],
  },
};

// ErrorBoundary local pour éviter qu'une erreur de parsing Markdown/KaTeX ne fasse planter l'application entière
class LatexErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erreur de rendu LaTeX/Markdown:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 2,
            my: 1,
            borderRadius: 2,
            bgcolor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <ErrorOutlineIcon color="error" />
          <Typography variant="body2" color="error">
            <strong>Erreur de rendu mathématique :</strong> syntaxe invalide.
            Vérifiez votre code LaTeX.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default function MathMarkdown({ content }: MathMarkdownProps) {
  const safeContent = content != null ? String(content) : "";

  // Si c'est vide, on ne rend rien
  if (!safeContent) return null;

  return (
    <LatexErrorBoundary>
      <div className="markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[
            [rehypeSanitize, mathSchema],
            [
              rehypeKatex,
              {
                throwOnError: false, // Ne pas lancer d'exception pour le LaTeX invalide
                strict: "ignore", // Ignorer les avertissements stricts
                errorColor: "#ef4444", // Couleur rouge pour le LaTeX invalide
              },
            ],
          ]}
        >
          {safeContent}
        </ReactMarkdown>
      </div>
    </LatexErrorBoundary>
  );
}
