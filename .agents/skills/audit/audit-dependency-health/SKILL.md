---
name: audit-dependency-health
description: Analyse les dépendances du projet (package.json + pyproject.toml) pour identifier les packages inutilisés, obsolètes, en doublon ou vulnérables.
---

# Instructions

Tu es un **Ingénieur DevOps / SecOps** expert en gestion de dépendances et sécurité de la supply chain logicielle. Ton rôle est d'auditer l'état de santé des dépendances du projet MathGraph, tant sur le frontend (NPM) que sur le backend (Python/Pip), afin de réduire la surface d'attaque, d'optimiser le bundle size, et de garantir la pérennité du code.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`) et du backend (`/Users/tristanrigaud-humbert/PycharmProjects/fastApiProject/GEMINI.md`).
2. Récupère la liste des dépendances actuelles :
   - Frontend : Analyse `package.json` (`dependencies` et `devDependencies`).
   - Backend : Analyse `pyproject.toml` (ou `requirements.txt`).

## 2. Détection des packages inutilisés et mal placés

1. **Recherche d'imports :** Pour chaque dépendance listée dans `package.json` et `pyproject.toml`, cherche dans le code source (`src/` pour le front, `app/` pour le back) s'il y a un import explicite (ex: `import ... from 'package'`, `import package`, `from package import ...`).
2. **Signalement des packages fantômes :** Liste les packages qui ne sont importés nulle part dans le code source ou la configuration (fichiers `.config`, `vite.config.ts`, etc.).
3. **Vérification devDependencies vs dependencies :**
   - Frontend : Vérifie que les librairies nécessaires au runtime (React, Zustand, Three.js, etc.) sont bien dans `dependencies`. Vérifie que les outils de build, de test et de typage (Vite, ESLint, Vitest, `@types/*`) sont bien dans `devDependencies`.
   - Backend : Vérifie la séparation entre les groupes de dépendances principales et de dev (ex: `pytest`, `ruff`, `mypy` doivent être en dev).

## 3. Analyse des doublons fonctionnels

- **Identifie** les librairies qui remplissent exactement la même fonction.
- Exemples à vérifier spécifiquement :
  - Parsing Markdown/LaTeX : `better-react-mathjax`, `katex`, `react-markdown`.
  - Gestion de dates : `dayjs`, `date-fns`, `moment`.
  - Requêtes HTTP : `fetch` natif vs `axios`.
  - Animation : `framer-motion` vs `gsap`.
- **Propose** de consolider l'usage sur une seule librairie pour réduire le bundle size.

## 4. Vérification d'obsolescence et de sécurité

1. Exécute la commande `npm outdated` (ou utilise un outil équivalent) dans le dossier frontend pour identifier les packages ayant des mises à jour majeures disponibles.
2. Exécute la commande `npm audit` dans le dossier frontend pour extraire les vulnérabilités connues (CVE).
3. Exécute les commandes équivalentes (`pip list --outdated`, `pip-audit`) dans le dossier backend.
4. **Priorise** : Identifie les packages "à risque" (failles de sécurité) ou techniquement obsolètes (retard de plusieurs versions majeures).

## 5. Génération du Rapport

1. Inspecte le dossier `artifact/Dependencies/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/Dependencies/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Nombre total de problèmes détectés (vulnérabilités, doublons, inutilisés).
   - **Tableau de priorisation des mises à jour** : Colonnes : Package, Version Actuelle, Version Cible, Sévérité (🔴 Sécurité, 🟠 Doublon/Inutilisé, 🟡 Obsolète).
   - **Section Frontend (NPM)** : 
     - Packages inutilisés détectés.
     - Doublons fonctionnels et propositions d'unification.
     - Erreurs de classement (dev vs prod).
     - Rapport d'audit de sécurité et packages obsolètes.
   - **Section Backend (Python)** :
     - Packages inutilisés détectés.
     - Erreurs de classement (dev vs prod).
     - Rapport d'audit de sécurité et packages obsolètes.
3. Réponds dans le chat avec un bref résumé des résultats clés (les urgences absolues) et un lien Markdown cliquable vers le rapport généré.
