import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { draftApi } from "../../services/api";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DraftDiffView } from "../Drafts/DraftDiffView";
import { Draft } from "../../types/ApiTypes/draft";

export const DraftsPanel: React.FC = () => {
  const { data: drafts, isLoading } = useQuery({
    queryKey: ["myDrafts"],
    queryFn: draftApi.getMyDrafts,
  });

  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  if (isLoading) return <CircularProgress />;

  if (!drafts || drafts.length === 0) {
    return (
      <Typography color="textSecondary">Aucun brouillon en cours.</Typography>
    );
  }

  return (
    <Box>
      <List>
        {drafts.map((draft) => (
          <ListItem key={draft.id} disablePadding>
            <ListItemButton onClick={() => setSelectedDraft(draft)}>
              <ListItemText
                primary={
                  draft.concept_id
                    ? `Brouillon pour concept #${draft.concept_id}`
                    : "Nouveau Concept"
                }
                secondary={`Dernière modification : ${new Date(draft.updated_at).toLocaleString()}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {selectedDraft && (
        <DraftDiffView
          open={!!selectedDraft}
          draft={selectedDraft}
          onClose={() => setSelectedDraft(null)}
        />
      )}
    </Box>
  );
};
