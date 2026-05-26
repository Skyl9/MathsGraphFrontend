import React from "react";
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

const ContributionPage: React.FC = () => (

   <>
  <Box sx={{ maxWidth: 650, mx: "auto", my: 4 }}>
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Contribuer au site : mode d’emploi ✍️
      </Typography>
      <Typography variant="body1" gutterBottom>
        Merci de vouloir améliorer le site ! Voici les règles simples pour participer :
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        ✅ Ce que vous pouvez faire
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
          <ListItemText primary="Corriger une erreur ou une faute (orthographe, explications…)" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
          <ListItemText primary="Ajouter des exemples, précisions, ou références fiables" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
          <ListItemText primary="Améliorer la clarté d’un texte sans le rendre trop complexe" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
          <ListItemText primary="Créer une nouvelle fiche sur un sujet pertinent" />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        ❌ Ce qu’il vaut mieux éviter
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
          <ListItemText primary="Copier du contenu protégé par des droits d’auteur" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
          <ListItemText primary="Effacer sans raison du travail d’un·e autre" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
          <ListItemText primary="Ajouter des blagues, opinions ou contenus hors sujet" />
        </ListItem>
        <ListItem>
          <ListItemIcon><CancelIcon color="error" /></ListItemIcon>
          <ListItemText primary="Mettre en avant un site, produit ou service" />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        <EmojiObjectsIcon sx={{ verticalAlign: "middle", mr: 1 }} />
        Quelques bons réflexes
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Relisez-vous avant de valider !" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Si vous n’êtes pas sûr, proposez : la modération vous aidera." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Restez bienveillant et respectueux envers les autres contributeurs." />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" align="center">
        🚀 Merci pour votre aide, même une simple correction fait avancer tout le projet !
      </Typography>
    </Paper>
  </Box>
     </>
);

export default ContributionPage;
