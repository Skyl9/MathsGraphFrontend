import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getNodeColor } from "../../utils/nodeColors";

interface MenuSearchResultsProps {
  searchResults: any[];
  isSearchActive: boolean;
  handleResultsSearch: (result: any) => void;
  darkMode: boolean;
  colorAxiome: string;
  colorLemme: string;
  colorTheoreme: string;
  colorReciproque: string;
  colorDefinition: string;
  colorCorollaire: string;
  colorProposition: string;
  colorPropriete: string;
}

export default function MenuSearchResults({
  searchResults,
  isSearchActive,
  handleResultsSearch,
  darkMode,
  colorAxiome,
  colorLemme,
  colorTheoreme,
  colorReciproque,
  colorDefinition,
  colorCorollaire,
  colorProposition,
  colorPropriete,
}: MenuSearchResultsProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (!isSearchActive) return null;

  return (
    <>
      {searchResults.length > 0 && (
        <div
          className="search-results"
          style={{
            background: darkMode
              ? alpha(theme.palette.background.paper, 0.85)
              : alpha(theme.palette.background.paper, 0.85),
            backdropFilter: "blur(16px)",
            border: darkMode
              ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
              : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            color: darkMode ? "#F1F5F9" : "#0F172A",
          }}
        >
          {searchResults.map((result) => {
            const badgeColor = getNodeColor(result.typeMath, [
              colorLemme,
              colorAxiome,
              colorTheoreme,
              colorReciproque,
              colorDefinition,
              colorCorollaire,
              colorProposition,
              colorPropriete,
            ]);

            return (
              <div
                key={result.id}
                className="search-result-item"
                onClick={() => handleResultsSearch(result)}
                style={{
                  borderLeft: `3px solid ${badgeColor}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode
                    ? alpha(theme.palette.divider, 0.06)
                    : alpha(theme.palette.divider, 0.04);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="search-result-title">{result.nom}</span>
                <span
                  className="search-result-meta"
                  style={{ color: badgeColor }}
                >
                  {result.typeMath}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {searchResults.length === 0 && (
        <div
          className="search-results"
          style={{
            background: darkMode
              ? alpha(theme.palette.background.paper, 0.85)
              : alpha(theme.palette.background.paper, 0.85),
            backdropFilter: "blur(16px)",
            border: darkMode
              ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
              : `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            color: darkMode ? "#F1F5F9" : "#0F172A",
          }}
        >
          <div className="search-no-results">
            {t("search.no_concept_found")}
          </div>
        </div>
      )}
    </>
  );
}
