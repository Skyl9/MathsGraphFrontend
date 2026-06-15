import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { diffWordsWithSpace, diffChars } from "diff";
import { useTranslation } from "react-i18next";

interface VisualDiffProps {
  oldValue: unknown;
  newValue: unknown;
  type?: "words" | "chars";
}

export const VisualDiff: React.FC<VisualDiffProps> = ({
  oldValue,
  newValue,
  type = "words",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { t } = useTranslation();

  const oldStr =
    typeof oldValue === "string"
      ? oldValue
      : oldValue
        ? JSON.stringify(oldValue, null, 2)
        : "";
  const newStr =
    typeof newValue === "string"
      ? newValue
      : newValue
        ? JSON.stringify(newValue, null, 2)
        : "";

  if (!oldStr && !newStr) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: "italic" }}
      >
        {t("diff.no_change")}
      </Typography>
    );
  }

  const diffs =
    type === "chars"
      ? diffChars(oldStr, newStr)
      : diffWordsWithSpace(oldStr, newStr);

  return (
    <Box
      sx={{
        fontFamily:
          '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        p: 2,
        bgcolor: isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.02)",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
        borderRadius: 2,
        fontSize: "0.85rem",
        maxHeight: "400px",
        overflowY: "auto",
        lineHeight: 1.6,
      }}
    >
      {diffs.map((part, index) => {
        let color = isDark ? "#e2e8f0" : "#334155";
        let bgcolor = "transparent";
        let textDecoration = "none";

        if (part.added) {
          color = isDark ? "#6ee7b7" : "#065f46";
          bgcolor = isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5";
        } else if (part.removed) {
          color = isDark ? "#fca5a5" : "#991b1b";
          bgcolor = isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2";
          textDecoration = "line-through";
        }

        return (
          <Typography
            key={index}
            component="span"
            sx={{
              color,
              bgcolor,
              textDecoration,
              borderRadius: "3px",
              fontFamily: "inherit",
              fontSize: "inherit",
            }}
          >
            {part.value}
          </Typography>
        );
      })}
    </Box>
  );
};
