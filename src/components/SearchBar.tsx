import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSearch: (query: string) => void;
  setIsSearch: (val: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, setIsSearch }) => {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setQuery(val);
    if (val.trim() === "") {
      setIsSearch(false);
      onSearch("");
    } else {
      setIsSearch(true);
      onSearch(val);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsSearch(false);
    onSearch("");
  };

  return (
    <TextField
      fullWidth
      placeholder={t("search.concept_placeholder")}
      variant="outlined"
      size="small"
      value={query}
      onChange={handleInputChange}
      autoComplete="off"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear} edge="end">
                <ClearIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)", // opaque transparent backdrop
          backdropFilter: "blur(12px)",
          transition: "all 0.2s ease",
          paddingRight: "6px",
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.15)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.3)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: "1.5px",
          },
        },
      }}
    />
  );
};

export default SearchBar;
