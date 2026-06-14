import { ChangeEvent } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { SearchFilters as SearchFiltersType } from "../services/api";

interface Props {
  filters: SearchFiltersType;
  handleFilterChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (event: SelectChangeEvent<number | "">) => void;
  handleDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  categories?: any[];
  types?: any[];
  mathematiciens?: any[];
}

export const SearchFilters = ({
  filters,
  handleFilterChange,
  handleSelectChange,
  handleDateChange,
  categories,
  types,
  mathematiciens,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={3.5}>
      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          {t("search.content_type")}
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.concept}
                onChange={handleFilterChange}
                name="concept"
                color="primary"
              />
            }
            label={t("search.concepts")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.mathematicien}
                onChange={handleFilterChange}
                name="mathematicien"
                color="primary"
              />
            }
            label={t("search.mathematicians")}
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.category}
                onChange={handleFilterChange}
                name="category"
                color="primary"
              />
            }
            label="Catégories"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
        </FormGroup>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Statut / Qualité
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.verifiedOnly}
                onChange={handleFilterChange}
                name="verifiedOnly"
                color="primary"
              />
            }
            label="Concepts vérifiés uniquement"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontWeight: 600,
                fontSize: "0.9rem",
              },
            }}
          />
        </FormGroup>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Spécificités
        </Typography>
        <Stack spacing={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie_id"
              value={filters.categorie_id === null ? "" : filters.categorie_id}
              onChange={handleSelectChange}
              label="Catégorie"
              disabled={!categories}
            >
              <MenuItem value="">
                <em>Toutes</em>
              </MenuItem>
              {categories?.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              name="type_id"
              value={filters.type_id === null ? "" : filters.type_id}
              onChange={handleSelectChange}
              label="Type"
              disabled={!types}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {types?.map((type: any) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Mathématicien</InputLabel>
            <Select
              name="mathematicien_id"
              value={
                filters.mathematicien_id === null
                  ? ""
                  : filters.mathematicien_id
              }
              onChange={handleSelectChange}
              label="Mathématicien"
              disabled={!mathematiciens}
            >
              <MenuItem value="">
                <em>Tous</em>
              </MenuItem>
              {mathematiciens?.map((math: any) => (
                <MenuItem key={math.id} value={math.id}>
                  {math.nom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            mb: 2,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            letterSpacing: "0.05em",
          }}
        >
          Période (Années)
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <TextField
            name="date_start"
            label="De (ex: -300)"
            variant="outlined"
            size="small"
            placeholder="-300"
            onChange={handleDateChange}
            sx={{ flex: 1 }}
          />
          <TextField
            name="date_end"
            label="À (ex: 1800)"
            variant="outlined"
            size="small"
            placeholder="1800"
            onChange={handleDateChange}
            sx={{ flex: 1 }}
          />
        </Stack>
      </Box>
    </Stack>
  );
};
