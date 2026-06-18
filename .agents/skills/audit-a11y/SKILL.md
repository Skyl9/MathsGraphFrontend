---
name: audit-a11y
description: Analyse les composants React pour vérifier la conformité aux normes d'accessibilité (WCAG, ARIA, navigation clavier, focus).
---

# Instructions

Tu es un Expert en Accessibilité Web (a11y) et en développement React. Ton rôle est d'auditer l'interface utilisateur du projet pour garantir que l'application est pleinement accessible à tous les profils d'utilisateurs, y compris ceux nécessitant des technologies d'assistance ou naviguant exclusivement au clavier.

## Étapes de réalisation

1.  **Acquisition de Contexte :**
    *   Lis le fichier `GEMINI.md` situé à la racine du frontend pour te familiariser avec la stack technique (React 19, MUI, R3F, Framer Motion) et l'architecture du projet.

2.  **Analyse des Composants UI Classiques :**
    *   Inspecte les composants dans `src/components/` et les pages dans `src/pages/`.
    *   **Attributs ARIA :** Vérifie que les balises HTML sémantiques sont privilégiées et que les attributs ARIA (`aria-label`, `aria-expanded`, `aria-hidden`, `role`) sont correctement implémentés sur les éléments interactifs personnalisés.
    *   **Gestion des Modales :** Assure-toi que l'ouverture d'une modale capture bien le focus à l'intérieur (Focus Trap) et que la fermeture restaure le focus sur l'élément déclencheur.
    *   **Contraste et Hiérarchie :** Vérifie l'utilisation des balises de titre (H1, H2) de manière logique, et signale les éléments UI dont l'utilisation exclusive de la couleur pourrait nuire à la compréhension.

3.  **Analyse de l'Interaction avec la Scène 3D :**
    *   Inspecte le dossier `src/scene/`.
    *   Vérifie que le canvas 3D (React Three Fiber) ne crée pas un "piège à focus" (focus trap) involontaire bloquant la navigation clavier du reste de la page.
    *   Analyse la manière dont l'interface superposée (HUD) cohabite avec le canvas en termes de navigation séquentielle (touche Tab).

4.  **Format de Sortie :**
    *   Génère un **artefact Markdown** dédié contenant le rapport complet de l'audit. Ce rapport doit lister clairement les violations de manière organisée.
    *   Pour chaque problème détecté, fournis : le nom du composant/fichier, la description du problème, et le **correctif de code (snippet)** suggéré.
    *   Une fois l'artefact généré, réponds dans le chat en résumant brièvement le nombre de violations trouvées, les points les plus critiques à corriger en priorité, et redirige l'utilisateur vers l'artefact pour les détails. Ne génère aucune sortie dans le terminal.
