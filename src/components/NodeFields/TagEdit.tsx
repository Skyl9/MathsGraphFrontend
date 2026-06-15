import React, { useEffect, useState } from "react";
import { Tag } from "../../types/types";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Autocomplete,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { nodeApi } from "../../services/api";

interface TagEditProps {
  tags: Tag[] | undefined | null;
  conceptId: string;
  refetchData: () => void;
}

const TagEdit: React.FC<TagEditProps> = ({ tags, conceptId, refetchData }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // Récupérer tous les tags au montage du composant
  useEffect(() => {
    const fetchAllTags = async () => {
      try {
        const tagsRes = await nodeApi.getAllTagName();
        setAllTags(tagsRes || []);
      } catch {
        setAllTags([]);
      }
    };
    fetchAllTags();
  }, []);

  const tagList: Tag[] = Array.isArray(tags) ? tags : [];

  const handleCreateTag = async (tagLabel: string) => {
    await nodeApi.createTags(tagLabel);
    setShowAdd(false);
    setInputValue("");
    setSelectedTag(null);
    const tagsRes = await nodeApi.getAllTagName();
    setAllTags(tagsRes || []);
    refetchData();
  };

  const handleAddTag = async () => {
    if (selectedTag) {
      await nodeApi.createLinkTagConcept(parseInt(conceptId), selectedTag.id);
    } else if (inputValue.trim() !== "") {
      await handleCreateTag(inputValue.trim());
      return;
    }
    setShowAdd(false);
    setInputValue("");
    setSelectedTag(null);
    const tagsRes = await nodeApi.getAllTagName();
    setAllTags(tagsRes || []);
    refetchData();
  };

  const handleDelete = async (tagId: number) => {
    await nodeApi.removeTagsFromConceptId(parseInt(conceptId), tagId);
    const tagsRes = await nodeApi.getAllTagName();
    setAllTags(tagsRes || []);
    refetchData();
  };

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 500, mt: 2 }}>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            letterSpacing: 1,
            mb: 2,
            color: "primary.main",
          }}
        >
          Tags liés à ce concept
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", minHeight: 48, mb: 1 }}
          alignItems="center"
        >
          {tagList.length > 0 ? (
            tagList.map((tag) =>
              tag ? (
                <Chip
                  key={tag.id}
                  label={tag.tag}
                  onDelete={() => handleDelete(tag.id)}
                  deleteIcon={<DeleteIcon />}
                  color="info"
                  variant="filled"
                  sx={{ mb: 1 }}
                />
              ) : null,
            )
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1, fontStyle: "italic" }}
            >
              Aucun tag pour ce concept.
            </Typography>
          )}
        </Stack>

        <Box mt={2} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {showAdd ? (
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                background: "#fafbfe",
                p: 1,
                mt: 1,
              }}
            >
              <Autocomplete
                sx={{ flex: 1, minWidth: 180 }}
                options={allTags.filter(
                  (opt) => !tagList.some((t) => t.tag === opt.tag),
                )}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.tag
                }
                value={selectedTag}
                inputValue={inputValue}
                onInputChange={(_, value) => setInputValue(value)}
                onChange={(_, value) => {
                  if (typeof value === "string" || value === null) {
                    setSelectedTag(null);
                    setInputValue(value ?? "");
                  } else {
                    setSelectedTag(value);
                    setInputValue(value.tag);
                  }
                }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nouveau tag ou existant"
                    size="small"
                    variant="outlined"
                  />
                )}
                filterOptions={(options, state) => {
                  const input = state.inputValue.trim();
                  const filtered = options.filter(
                    (opt) =>
                      !tagList.some((t) => t.tag === opt.tag) &&
                      opt.tag.toLowerCase().includes(input.toLowerCase()),
                  );
                  if (
                    input !== "" &&
                    !allTags.some(
                      (opt) => opt.tag.toLowerCase() === input.toLowerCase(),
                    )
                  ) {
                    filtered.push({
                      id: Number.MIN_SAFE_INTEGER,
                      tag: `Créer "${input}"`,
                    } as Tag);
                  }
                  return filtered;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim() !== "") {
                    handleAddTag();
                    e.preventDefault();
                  }
                }}
              />
              <Button
                onClick={handleAddTag}
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: 90 }}
              >
                Ajouter
              </Button>
              <Button
                onClick={() => {
                  setShowAdd(false);
                  setInputValue("");
                  setSelectedTag(null);
                }}
                color="inherit"
                size="small"
                sx={{ border: "1px solid", borderColor: "grey.300" }}
              >
                Annuler
              </Button>
            </Paper>
          ) : (
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              onClick={() => setShowAdd(true)}
              sx={{
                alignSelf: "flex-start",
                mt: 1,
                fontWeight: 600,
                borderRadius: 2,
                borderColor: "primary.light",
                color: "primary.main",
                px: 2,
                background: "white",
                transition: "background 0.2s",
                "&:hover": {
                  background: "primary.lighter",
                  borderColor: "primary.main",
                },
              }}
              size="small"
            >
              Ajouter un tag
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default TagEdit;
