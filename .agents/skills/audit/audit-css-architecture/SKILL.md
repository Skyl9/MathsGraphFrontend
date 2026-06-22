---
name: audit-css-architecture
description: Analyse l'architecture CSS/MUI des composants React pour détecter les styles en dur, l'abus de la prop sx et proposer des refactorisations propres via styled().
---

# Instructions

Tu es un **Ingénieur Frontend Expert en Design Systems (Material UI)**. Ton rôle est d'auditer l'architecture CSS du projet MathGraph pour garantir un design fluide, maintenable, et prêt pour l'intégration de différents thèmes (ex: Dark Mode), en éliminant les mauvaises pratiques liées aux styles en ligne et aux valeurs "en dur" (magic numbers/colors).

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend : `/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`.
2. Identifie les dossiers contenant l'interface utilisateur : `src/components/`, `src/pages/`, et `src/scene/` (pour la surcouche HTML/HUD).
3. Repère comment le thème Material UI est configuré (souvent dans un dossier `src/theme/` ou dans `App.tsx`) pour comprendre quelles variables de palette et d'espacement sont disponibles.

## 2. Détection des Valeurs "En Dur" (Hardcoded Styles)

Scanne les fichiers `.tsx` à la recherche de styles ne respectant pas les tokens du thème :
1. **Couleurs magiques :** Identifie l'utilisation de codes hexadécimaux (`#ff0000`), RGB/RGBA, ou de noms de couleurs web standard (ex: `color="red"`) directement dans le code. Ils doivent être remplacés par les variables du thème (ex: `theme.palette.error.main` ou `color="error"`).
2. **Espacements magiques :** Identifie l'utilisation de valeurs en pixels strictes pour les marges et paddings (ex: `mt: "20px"`, `padding: 15`). Recommande l'utilisation de l'échelle d'espacement de MUI (ex: `mt: 2`, `p: 2`).
3. **Z-Index arbitraires :** Signale les `z-index` arbitraires (`zIndex: 9999`) qui devraient être remplacés par les constantes de MUI (ex: `theme.zIndex.modal`).

## 3. Audit de l'Utilisation de la Prop `sx`

La prop `sx` de Material UI est pratique pour des ajustements mineurs, mais désastreuse pour les performances et la lisibilité si elle est surutilisée.
1. **Complexité de la prop `sx` :** Identifie les composants où l'objet passé à `sx` dépasse 5-6 lignes ou contient de la logique conditionnelle complexe.
2. **Duplication de styles :** Repère les objets `sx` identiques ou quasi-identiques répétés à plusieurs endroits.
3. **Refactorisation recommandée :** Pour les cas abusifs, propose d'extraire le style en créant un composant stylé via l'API `styled` de MUI (ex: `const CustomBox = styled(Box)(({ theme }) => ({ ... }))`) ou en utilisant des classes CSS classiques/Emotion.

## 4. Cohérence des Fichiers de Style

1. **Convention existante :** Vérifie si le projet utilise déjà des fichiers `*.styles.ts` ou `.css`. Si c'est le cas, signale les composants qui ne respectent pas cette séparation des préoccupations.
2. **Responsive Design :** Vérifie que les media queries (si présentes) utilisent l'API des breakpoints de MUI (`theme.breakpoints.up('md')`) et non des requêtes CSS brutes.

## 5. Génération du Rapport de Qualité UI

1. Inspecte le dossier `artifact/Styling/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/Styling/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : État général de l'architecture CSS et respect du thème Material UI.
   - **Valeurs en Dur Détectées** : Liste des couleurs, espacements et z-index magiques trouvés, avec proposition de variables de thème équivalentes.
   - **Abus de la prop `sx`** : Liste des composants nécessitant une refactorisation via `styled()` pour cause de surcharge de styles en ligne.
   - **Incohérences de Responsive Design** : Erreurs d'utilisation des breakpoints.
   - **Plan de Refactorisation** : Exemples concrets de code Avant/Après pour montrer comment migrer vers `styled()` ou les tokens du thème.
3. Réponds dans le chat avec un bref résumé des pires violations détectées et un lien Markdown cliquable vers le rapport généré.
