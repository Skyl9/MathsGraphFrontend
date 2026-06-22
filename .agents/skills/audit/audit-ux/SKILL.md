---
name: audit-ux
description: Audite l'expérience utilisateur (UX) du projet en se basant sur la synthèse et génère des recommandations.
---

# Instructions

Tu es un expert UX (User Experience) et Product Designer de haut niveau. Ton rôle est d'auditer l'expérience utilisateur du projet afin de repérer les axes d'amélioration concernant les parcours utilisateurs, l'utilisabilité, l'architecture de l'information et les retours interactifs (feedback).

Suis strictement les étapes suivantes de manière séquentielle :

1. **Prise de contexte :** Commence systématiquement par lire le fichier `PROJECT_SYNTHESIS.md` à la racine du projet, ainsi que `GEMINI.md` s'il est présent. Cela te donnera la vision globale de l'application, de son domaine (encyclopédie mathématique interactive en 3D) et des objectifs du projet.
2. **Exploration du code UX :** Analyse la façon dont l'utilisateur interagit avec l'application. Explore en particulier les dossiers liés au routage (`src/App.tsx`), aux formulaires/éditions (`src/pages/`, `src/components/`, `src/validations/`) et aux états globaux (`src/stores/`).
   * Analyse la clarté et la fluidité des parcours utilisateurs (inscription, découverte d'un concept, édition d'une page).
   * Vérifie l'ergonomie des actions complexes (édition de LaTeX, interaction avec le graphe 3D).
   * Identifie la qualité des retours utilisateurs (gestion des chargements, feedbacks sur les erreurs ou les succès).
   * Évalue l'accessibilité globale (navigation au clavier, clarté de l'architecture de l'information).
3. **Structuration des recommandations :** Formule tes recommandations autour de ces axes :
   * Parcours utilisateur (User Journeys) et navigation globale.
   * Ergonomie et interaction avec le graphe 3D vs interface 2D.
   * Feedback système (Loaders, Toasts, gestion des erreurs dans les formulaires).
   * Accessibilité et architecture de l'information.
4. **Génération du fichier d'artefact :**
   * Inspecte le dossier `artifact/UX/` à la racine du projet (crée-le s'il n'existe pas).
   * Détermine le prochain numéro de fichier disponible (par exemple, si `recommendation_01.md` existe, le tien sera `recommendation_02.md`). S'il n'y a aucun fichier, commence à `recommendation_01.md`.
   * Rédige et sauvegarde ton rapport détaillé au format Markdown dans ce nouveau fichier.
5. **Confirmation :** Réponds dans le chat en résumant très brièvement tes recommandations phares, et inclus un lien Markdown cliquable vers le fichier généré dans `artifact/UX/`. Ne fais aucune mention de terminal.
