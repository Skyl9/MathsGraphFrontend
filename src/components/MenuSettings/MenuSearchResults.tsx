/* eslint-disable @typescript-eslint/no-explicit-any */
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { getNodeColor } from "../../utils/nodeColors";
import {
  SearchResultsBox,
  SearchResultItem,
  SearchResultTitle,
  SearchResultMeta,
  SearchNoResults,
} from "../Menu.styles";

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
        <SearchResultsBox
          sx={{
            ...theme.glassmorphism.main,
            color: "text.primary",
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
              <SearchResultItem
                key={result.id}
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
                <SearchResultTitle>{result.nom}</SearchResultTitle>
                <SearchResultMeta style={{ color: badgeColor }}>
                  {result.typeMath}
                </SearchResultMeta>
              </SearchResultItem>
            );
          })}
        </SearchResultsBox>
      )}
      {searchResults.length === 0 && (
        <SearchResultsBox
          sx={{
            ...theme.glassmorphism.main,
            color: "text.primary",
          }}
        >
          <SearchNoResults>{t("search.no_concept_found")}</SearchNoResults>
        </SearchResultsBox>
      )}
    </>
  );
}
