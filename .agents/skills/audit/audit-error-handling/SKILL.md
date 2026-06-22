---
name: audit-error-handling
description: Analyse la gestion des erreurs sur le backend FastAPI et le frontend React pour détecter les incohérences, les erreurs silencieuses et les composants non protégés.
---
# Instructions

Tu es un **Ingénieur Qualité / Reliability Engineer** expert en gestion d'erreurs applicatives. Ton rôle est d'auditer exhaustivement la stratégie de gestion d'erreurs du projet MathGraph, côté backend (FastAPI) et frontend (React 19), pour garantir qu'aucune erreur ne soit silencieusement ignorée et que l'utilisateur reçoive toujours un retour clair.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis les fichiers `GEMINI.md` des deux workspaces pour te familiariser avec l'architecture :
   - Backend : `/Users/tristanrigaud-humbert/PycharmProjects/fastApiProject/GEMINI.md`
   - Frontend : `/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`
2. Lis le fichier d'exceptions personnalisées du backend : `app/core/exceptions.py`. Les exceptions disponibles sont :
   - `BadRequestException` (400)
   - `AuthenticationException` (401)
   - `ForbiddenException` (403)
   - `NotFoundException` (404)
   - `ConflictException` (409)
   - `InternalServerError` (500)
3. Lis le composant `ErrorBoundary` du frontend : `src/ErrorBoundary.tsx`.
4. Identifie la librairie de notification utilisée (ex: `react-toastify`, `notistack`, etc.) en inspectant `src/App.tsx` et `package.json`.

## 2. Audit Backend (FastAPI)

Analyse chaque fichier de `app/services/` et `app/api/routes/` pour vérifier les points suivants :

### 2.1 Utilisation des exceptions personnalisées
- **Vérifie** que toutes les fonctions de service utilisent les exceptions de `app/core/exceptions.py` plutôt que de lever directement `HTTPException` ou de retourner des réponses avec des codes d'erreur manuels.
- **Signale** tout usage de `raise HTTPException(status_code=...)` qui devrait être remplacé par l'exception personnalisée correspondante (ex: `HTTPException(status_code=404)` → `NotFoundException`).

### 2.2 Blocs try/except
- **Identifie** les blocs `try/except` trop larges qui attrapent `Exception` ou `BaseException` sans re-lever l'erreur ou sans la loguer.
- **Signale** les fonctions de service qui effectuent des opérations en base de données sans aucun bloc `try/except` et sans laisser l'exception remonter naturellement jusqu'au handler FastAPI.
- **Vérifie** qu'aucun `except: pass` ou `except Exception: pass` n'existe dans le code (erreurs silencieuses).

### 2.3 Routes sans gestion d'erreur
- **Vérifie** que chaque route qui appelle un service gère correctement le cas où la ressource n'existe pas (ex: `NotFoundException` levée par le service).
- **Identifie** les routes qui retournent directement le résultat du service sans vérifier si le retour est `None`.

## 3. Audit Frontend (React)

Analyse le code source dans `src/` pour vérifier les points suivants :

### 3.1 ErrorBoundary
- **Vérifie** la couverture des `ErrorBoundary` : quels composants ou routes sont protégés et lesquels ne le sont pas.
- **Identifie** les composants critiques qui devraient avoir leur propre `ErrorBoundary` local (par analogie avec le `LatexErrorBoundary` de `MathMarkdown.tsx`). En particulier, vérifie les composants qui effectuent du parsing de données dynamiques (LaTeX, Markdown, dates, JSON).
- **Vérifie** que le `ErrorBoundary` global capture et affiche les erreurs de manière utile (pas juste un écran blanc).

### 3.2 Gestion des erreurs réseau (appels API)
- **Inspecte** le service API central (`src/services/api.ts`) pour vérifier s'il existe un intercepteur d'erreurs global (ex: intercepteur Axios, handler `fetch`).
- **Scanne** les hooks et composants qui effectuent des appels API (`src/hooks/`, `src/services/`) et vérifie que :
  - Les erreurs réseau (timeout, 500, offline) sont attrapées.
  - Un feedback visuel est fourni à l'utilisateur (toast, message d'erreur inline, etc.).
  - Les erreurs d'authentification (401) déclenchent bien une déconnexion ou une redirection.
- **Signale** tout appel `fetch` ou `axios` qui manque de `.catch()` ou de bloc `try/catch` sans notification utilisateur.

### 3.3 Toasts et retours utilisateur
- **Vérifie** que les opérations de mutation (création, modification, suppression) affichent systématiquement un toast de succès **et** d'erreur.
- **Identifie** les cas où une opération échoue silencieusement (pas de toast d'erreur, pas de message dans l'interface).
- **Vérifie** la cohérence des messages : les erreurs backend (`detail` des HTTPException) sont-elles transmises et affichées à l'utilisateur, ou remplacées par des messages génériques ?

## 4. Génération du Rapport

1. Inspecte le dossier `artifact/ErrorHandling/` du projet frontend. S'il n'existe pas, crée-le. Cherche les fichiers existants pour déterminer le prochain numéro logique (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Nombre total de problèmes détectés, répartis par catégorie (Backend / Frontend) et par sévérité (🔴 Critique, 🟠 Modéré, 🟡 Mineur).
   - **Section Backend** : Liste des problèmes trouvés, avec pour chacun le fichier, la ligne, l'extrait de code problématique, et le correctif proposé.
   - **Section Frontend** : Même format que le backend.
   - **Tableau récapitulatif** : Un tableau Markdown résumant tous les points d'action.

3. Réponds également dans le chat avec un bref résumé des résultats et un lien Markdown cliquable vers le rapport généré.
