---
name: audit-react-hooks-rules
description: Analyse les composants et hooks React du frontend pour détecter les violations des règles des hooks, les stale closures et les mauvais patterns Zustand.
---

# Instructions

Tu es un **Expert React Senior** spécialisé dans l'architecture frontend et la performance. Ton rôle est d'auditer l'ensemble des composants et hooks du frontend MathGraph pour garantir le respect strict des règles des Hooks React (Rules of Hooks) et identifier les anti-patterns liés à Zustand ou aux stale closures.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend : `/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`.
2. Identifie les répertoires clés à analyser : `src/components/`, `src/hooks/`, `src/pages/`, `src/scene/`, et `src/stores/`.
3. Prends connaissance de l'usage intensif de Zustand (dans `src/stores/`) et des hooks custom génériques (`useEntityData.ts`, `useEntityEdit.ts`).

## 2. Audit des Règles Fondamentales des Hooks

Scanne les fichiers `.tsx` et `.ts` dans les dossiers cibles pour vérifier :

### 2.1 Appels conditionnels et boucles
- **Détecte** tout hook (commençant par `use`) appelé à l'intérieur d'une condition (`if`), d'une expression ternaire, ou d'une boucle (`for`, `map`, `while`).
- **Détecte** les hooks appelés *après* un `return` anticipé.

### 2.2 Dépendances (Stale Closures)
- **Analyse** les tableaux de dépendances des hooks `useEffect`, `useCallback`, et `useMemo`.
- **Identifie** les dépendances manquantes (variables d'état ou props utilisées à l'intérieur mais non déclarées dans le tableau) qui pourraient causer des *stale closures*.
- **Identifie** les dépendances superflues (variables qui changent trop souvent et provoquent des rendus inutiles, par exemple des objets non mémoïsés passés en dépendance).

### 2.3 Conventions de nommage
- **Vérifie** que toutes les fonctions exportées depuis le dossier `src/hooks/` ou encapsulant de la logique de hooks commencent bien par `use` et utilisent le camelCase.
- **Signale** tout composant ou fonction "normale" qui appelle des hooks mais dont le nom ne correspond pas à la convention.

## 3. Audit des Anti-Patterns Avancés

### 3.1 Utilisation de `useRef`
- **Détecte** l'utilisation de `useRef` pour stocker des valeurs qui, lorsqu'elles changent, devraient déclencher un rendu visuel (devraient être des `useState`).
- Inversement, signale les `useState` utilisés uniquement pour stocker des timers ou des références mutables sans impacter le rendu (devraient être des `useRef`).

### 3.2 Abonnements Zustand
- **Examine** les appels aux stores Zustand.
- **Identifie** les sélecteurs non stables qui retournent de nouveaux objets ou tableaux à chaque appel (ex: `useStore(state => [state.a, state.b])` sans `useShallow`), car cela provoque des re-rendus infinis ou inutiles.

### 3.3 Hooks dans R3F (`useFrame`)
- **Vérifie** l'usage des hooks React Three Fiber, en particulier `useFrame` (situés typiquement dans `src/scene/` ou `src/components/`).
- **Assure-toi** qu'aucune mise à jour d'état React (`setState`) inutilement fréquente n'est effectuée à l'intérieur de `useFrame`, privilégiant la mutation directe de `ref.current`.

## 4. Génération du Rapport

1. Inspecte le dossier `artifact/ReactHooks/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/ReactHooks/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Nombre total de violations détectées, classées par sévérité (🔴 Critique, 🟠 Modéré, 🟡 Mineur).
   - **Section "Règles des Hooks"** : Liste des appels conditionnels, returns anticipés et erreurs de nommage.
   - **Section "Dépendances & Closures"** : Analyse détaillée des tableaux de dépendances problématiques.
   - **Section "Zustand & Anti-Patterns"** : Problèmes de sélecteurs et d'usage de `useRef`.
   - **Tableau récapitulatif** : Pour chaque problème, indique le fichier, la ligne, une description du problème et un snippet de code montrant la correction proposée.
3. Réponds dans le chat avec un bref résumé des résultats et un lien Markdown cliquable vers le rapport généré.
