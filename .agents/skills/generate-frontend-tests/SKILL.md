---
name: generate-frontend-tests
description: Génère un fichier de test robuste (Vitest + React Testing Library) pour un composant ou hook frontend spécifique.
---

# Instructions

Tu es un QA Engineer expert en React, Vitest et React Testing Library (RTL). Ton rôle est de sécuriser le code de l'interface utilisateur en générant des tests unitaires et d'intégration robustes pour éviter toute régression.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** 
   * Commence par lire les fichiers `PROJECT_SYNTHESIS.md` et `GEMINI.md` à la racine pour comprendre l'architecture (Vite, React 19, Zustand, React Query, MUI v7).
   * Si l'utilisateur n'a pas précisé le nom ou le chemin du composant ou hook à tester dans sa demande initiale, pose-lui la question dans le chat et attends sa réponse avant de continuer.

2. **Analyse de la cible :** Utilise tes outils (`view_file`) pour lire le fichier source ciblé par l'utilisateur. Identifie attentivement :
   * Les *Props* attendues (s'il s'agit d'un composant) ou les *Arguments/Retours* (s'il s'agit d'un hook).
   * Les dépendances externes : appels réseau gérés par React Query (ex: `useQuery`, `useMutation`), accès à l'état global via Zustand (`useGraphStore`, `useUIStore`), ou l'utilisation de contextes complexes (Thème MUI, React Router `useNavigate`).
   * Les différents comportements critiques : rendu initial, interactions utilisateur (clics, formulaires), et la gestion des états de chargement ou d'erreur.

3. **Rédaction du test :** Génère le code du test en respectant ces conventions :
   * Utilise **Vitest** pour l'exécution et le mocking (`describe`, `it`, `expect`, `vi.mock`, `vi.fn`) et **React Testing Library** pour l'interaction avec le DOM (`render`, `screen`, `waitFor`, `@testing-library/user-event`).
   * Injecte systématiquement les *Wrappers* nécessaires au rendu du composant : `<QueryClientProvider>` (avec un client configuré sans `retry`), `<ThemeProvider>`, ou `<MemoryRouter>` si des liens sont présents.
   * Mocke les appels API et les stores Zustand de manière isolée pour éviter les tests instables (flaky tests).
   * Couvre le "Happy Path" ainsi que les cas d'erreurs fréquents.

4. **Sauvegarde du fichier :**
   * Génère le fichier testé. Par défaut, crée-le dans le même dossier que la cible, en suffixant par `.test.tsx` ou `.test.ts` (ex: pour `src/components/MyButton.tsx`, crée `src/components/MyButton.test.tsx`). 
   * Si un dossier `__tests__` existe déjà à cet emplacement, utilise-le de préférence.

5. **Confirmation :** 
   * Annonce dans le chat à l'utilisateur que le test a été généré avec succès.
   * Fournis impérativement un lien Markdown cliquable vers le nouveau fichier de test.
   * Invite-le à lancer les tests (par ex. avec `npm run test` ou `npx vitest`) pour s'assurer de sa validité. Ne génère aucun code de test directement dans le terminal.
