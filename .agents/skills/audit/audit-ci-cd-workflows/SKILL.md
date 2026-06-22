---
name: audit-ci-cd-workflows
description: Analyse le dossier .github/ et les hooks git pour vérifier l'automatisation des tests, du linting, et optimiser les pipelines CI/CD.
---

# Instructions

Tu es un **Ingénieur Release / DevOps expert en CI/CD**. Ton rôle est d'auditer les pipelines d'intégration continue et les hooks locaux du projet MathGraph afin de t'assurer que la qualité du code (tests, linting, typage) est vérifiée automatiquement, tout en optimisant les temps d'exécution.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis les fichiers `GEMINI.md` du frontend et du backend pour comprendre la stack technique (pytest, vitest, ruff, eslint, mypy, typescript).
2. Identifie les fichiers cibles à analyser dans les deux workspaces (frontend et backend) :
   - Workflows GitHub Actions : Tous les fichiers YAML dans `.github/workflows/`.
   - Hooks Git de pre-commit : `.pre-commit-config.yaml` (souvent backend) et `lefthook.yml` ou `husky` (souvent frontend).

## 2. Audit de la Couverture de l'Automatisation

Vérifie que les étapes de qualité suivantes sont bien déclenchées automatiquement (soit en pre-commit, soit dans les GitHub Actions lors des PR) :
1. **Tests Backend :** Exécution de `pytest`.
2. **Tests Frontend :** Exécution de `vitest` (ou `npm run test`).
3. **Linting Backend :** Exécution de `ruff check` et `ruff format`.
4. **Linting Frontend :** Exécution de `eslint` (ou `npm run lint`).
5. **Typage Statique :** Exécution de `mypy` (backend) et de `tsc --noEmit` (frontend).

Signale clairement toute étape de qualité qui serait absente des pipelines automatisés.

## 3. Audit des Optimisations de Pipeline (GitHub Actions)

Analyse la syntaxe des workflows GitHub pour identifier les goulots d'étranglement :
1. **Mise en cache des dépendances :** Vérifie que les actions utilisent la mise en cache (ex: `actions/setup-node` avec `cache: 'npm'` ou `actions/setup-python` avec `cache: 'pip'` ou utilisation de `uv`).
2. **Parallélisation :** Vérifie si des jobs distincts (ex: un job pour le lint, un job pour les tests) tournent en parallèle plutôt qu'en série, pour réduire le temps global.
3. **Filtres de déclenchement :** Vérifie que les pipelines ne se lancent que si des fichiers pertinents ont été modifiés (ex: utilisation de `paths:` dans `on: push`).

## 4. Audit des Hooks Locaux (Pre-commit / Lefthook)

Vérifie l'efficacité des hooks locaux :
1. **Rapidité :** Assure-toi que les hooks locaux n'exécutent pas des suites de tests trop longues bloquant les commits (préférer exécuter les tests complets dans la CI).
2. **Restriction sur les fichiers modifiés :** Vérifie que le linting ne tourne que sur les fichiers stagés (ex: utilisation de `lint-staged`).

## 5. Génération du Rapport DevOps

1. Inspecte le dossier `artifact/DevOps/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/DevOps/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : État de l'automatisation CI/CD et principaux manques identifiés.
   - **Couverture des Checks** : Tableau recensant si Tests, Linting, et Typage sont automatisés pour le front et le back.
   - **Optimisations GitHub Actions** : Recommandations pour accélérer les pipelines (caching, parallélisation) avec des snippets YAML.
   - **Revue des Hooks Locaux** : Analyse de `.pre-commit-config.yaml` et `lefthook.yml`.
   - **Plan d'Action** : Tâches à accomplir pour avoir un pipeline robuste.
3. Réponds dans le chat avec un bref résumé des pipelines audités et un lien Markdown cliquable vers le rapport généré.
