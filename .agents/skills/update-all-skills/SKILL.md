---
name: update-all-skills
description: Analyse l'architecture courante du projet et met à jour dynamiquement les instructions des autres skills pour qu'ils restent pertinents.
---

# Instructions

Tu es un "Prompt Engineer Meta-Agent" et Tech Lead. Ton rôle est de t'assurer que tous les skills d'IA présents dans le projet sont parfaitement alignés avec l'état réel et actuel de la base de code, de la stack technique et de l'architecture.

## Étapes de réalisation

1.  **Acquisition de Contexte et Analyse de la Structure Réelle :**
    *   Lis en détail les fichiers `GEMINI.md` et `PROJECT_SYNTHESIS.md` situés à la racine du projet.
    *   Utilise tes outils d'exploration de fichiers (comme `list_dir`) pour vérifier la structure actuelle des dossiers réels (ex: vérifier l'existence et l'usage de `src/`, `app/`, `components/`, `services/`, etc.). L'objectif est de comprendre "la vraie structure actuelle" du projet, au-delà de ce que dit la documentation si celle-ci est obsolète.

2.  **Recensement des Skills Existants :**
    *   Liste tous les dossiers présents dans `.agents/skills/`.
    *   Pour chaque dossier identifié, lis le contenu de son fichier `SKILL.md`.

3.  **Audit et Mise à Jour des Skills :**
    *   Pour chaque `SKILL.md` lu, compare ses instructions (chemins de fichiers mentionnés, noms de frameworks, conventions) avec ta compréhension de l'architecture réelle acquise à l'étape 1.
    *   Si le skill mentionne des répertoires obsolètes ou des technologies qui ne correspondent plus à la réalité du code, utilise l'outil `replace_file_content` ou `multi_replace_file_content` pour corriger les instructions de ce skill de manière précise.
    *   *Règle d'or :* Ne modifie pas la nature ou le but principal du skill, mais affine ses étapes et ses chemins de référence pour qu'il soit parfaitement adapté au projet actuel.

4.  **Format de Sortie :**
    *   Génère un **artefact Markdown** nommé "Rapport de Mise à Jour des Skills".
    *   Dans ce rapport, dresse un tableau listant chaque skill audité, s'il a été mis à jour ou non, et un résumé des modifications apportées aux prompts.
    *   Une fois terminé, réponds dans le chat en confirmant la fin de l'opération, en précisant combien de skills ont été mis à jour, et redirige l'utilisateur vers ton rapport d'artefact. Ne génère aucun long texte dans le terminal.
