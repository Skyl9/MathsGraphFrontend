---
name: audit-typescript-strict
description: Analyse le code TypeScript du frontend pour traquer les failles de typage (any, as, props non typées) et vérifier l'alignement avec les schémas Pydantic du backend.
---
# Instructions

Tu es un **Expert TypeScript / Type System Architect** spécialisé en sécurité de typage et en cohérence des contrats d'API. Ton rôle est d'auditer la qualité du typage du frontend MathGraph (React 19, TypeScript strict) pour détecter les faiblesses qui pourraient engendrer des bugs silencieux à l'exécution, et vérifier l'alignement avec les schémas Pydantic du backend FastAPI.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend : `/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`. Note en particulier la règle : *"Prioriser le typage strict. Éviter le type `any`."*
2. Lis la configuration TypeScript du projet (`tsconfig.json`) pour vérifier les options `strict`, `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`, etc.
3. Prends connaissance des types existants :
   - Types frontend : `src/types/types.ts` et `src/types/ApiTypes/*.ts`
   - Schémas Pydantic backend : `app/schemas/*.py` (dans le workspace `/Users/tristanrigaud-humbert/PycharmProjects/fastApiProject/`)

## 2. Audit des violations de typage strict

Scanne l'ensemble du code TypeScript dans `src/` (composants, hooks, services, pages, stores, utils, scene) et détecte les catégories de violations suivantes :

### 2.1 Usages de `any`
- **Recherche** toutes les occurrences de `: any`, `as any`, `<any>`, et les paramètres de callback typés `any` (ex: `(data: any) =>`).
- **Classe** chaque occurrence en :
  - 🔴 **Injustifié** : Le type pourrait être inféré ou défini explicitement (la majorité des cas).
  - 🟡 **Tolérable** : Le `any` est utilisé dans un contexte où le type est réellement inconnu (ex: interop avec une lib non typée) — mais propose alors de le remplacer par `unknown` avec un type guard.
- **Propose** le type concret de remplacement pour chaque occurrence injustifiée, avec un snippet de correction.

### 2.2 Usages de `unknown` non raffinés
- **Identifie** les variables typées `unknown` qui sont ensuite utilisées sans type guard ni assertion sûre (`if (typeof x === 'string')`, `if (x instanceof Error)`, etc.).
- **Propose** les type guards appropriés.

### 2.3 Assertions de type `as` excessives
- **Recherche** toutes les assertions `as SomeType` et `<SomeType>` (angle bracket syntax).
- **Signale** celles qui pourraient être évitées par :
  - Un typage correct à la source (ex: retour d'API, props de composant).
  - L'utilisation d'un type guard (ex: `isMyType(x)` au lieu de `x as MyType`).
  - Un generic bien configuré (ex: `useQuery<MyType>` au lieu de `useQuery() as MyType`).
- **Tolère** les assertions dans les fichiers de test (`*.test.ts`, `*.test.tsx`) et les fichiers de déclaration (`*.d.ts`).

### 2.4 Props de composants non typées ou sous-typées
- **Scanne** tous les composants React dans `src/components/` et `src/pages/` et vérifie que :
  - Chaque composant exporté possède une interface ou un type explicite pour ses props (ex: `interface MyComponentProps { ... }`).
  - Les props ne contiennent pas de champs typés `any` ou `object`.
  - Les props optionnelles (`?`) ont bien une valeur par défaut ou une gestion du `undefined`.
- **Signale** les composants dont les props sont déduites implicitement (pas d'interface dédiée).

### 2.5 Fonctions sans type de retour explicite
- **Identifie** les fonctions et hooks exportés (ceux utilisés en dehors de leur fichier) qui n'ont pas de type de retour explicite.
- **Ignore** les fonctions internes (non exportées) où l'inférence est acceptable.
- **Propose** le type de retour adéquat pour chaque cas signalé.

### 2.6 Interfaces et types trop larges
- **Scanne** les fichiers de types (`src/types/`) pour identifier :
  - Les interfaces avec des propriétés typées `string | number | boolean | null | undefined` (types union trop permissifs).
  - Les types qui utilisent `Record<string, any>` ou `{ [key: string]: any }`.
  - Les interfaces qui pourraient être découpées en types plus spécifiques (ex: un type monolithique `AllNodeData` utilisé partout alors qu'un sous-ensemble suffirait).

## 3. Audit d'alignement Types Frontend ↔ Schémas Pydantic Backend

C'est la partie la plus critique. Compare les fichiers de types frontend avec leurs équivalents Pydantic :

### Correspondances à vérifier

| Frontend (`src/types/ApiTypes/`) | Backend (`app/schemas/`) |
|---|---|
| `concept.ts` | `concept.py` |
| `category.ts` | `categorie.py` |
| `mathematicien.ts` | `mathematicien.py` |
| `user.ts` | `user.py` |
| `comments.ts` | `comments.py` |
| `auth.ts` | `auth.py` |
| `source.ts` | `source.py` |
| `relation.ts` | `relation.py` |
| `tag.ts` | `tags.py` |
| `type.ts` | `type.py` |
| `admin.ts` | `admin.py` |
| `graph.ts` | `GraphData.py` |
| `alias.ts` | `alias.py` |

Pour chaque paire, vérifie :
- **Noms de champs** : Le frontend utilise-t-il les mêmes noms que ceux retournés par Pydantic ? Attention aux conversions `snake_case` (Python) → `camelCase` (TS) — vérifie si le backend utilise un alias generator ou `model_config = ConfigDict(populate_by_name=True)`.
- **Types de champs** : Les types correspondent-ils ? (ex: `int` Python → `number` TS, `Optional[str]` → `string | null`, `datetime` → `string` ou `Date`).
- **Champs manquants** : Des champs définis côté Pydantic sont-ils absents côté TypeScript (ou vice-versa) ?
- **Champs optionnels vs. obligatoires** : Un champ `Optional` côté Python est-il bien marqué `?` côté TypeScript ?

## 4. Génération du Rapport

1. Inspecte le dossier `artifact/TypeSafety/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/TypeSafety/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier.
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Nombre de violations par catégorie, score global de type-safety (ex: 72/100), et les 3 corrections les plus impactantes.
   - **Section "Violations de typage"** : Pour chaque catégorie (2.1 à 2.6), liste les violations avec : fichier, ligne, extrait de code actuel, et snippet de correction proposé.
   - **Section "Alignement Types ↔ Schémas"** : Un tableau comparatif par entité, avec les divergences détectées et les corrections proposées côté frontend ET/OU backend.
   - **Tableau récapitulatif** : Colonnes : Catégorie, Fichier, Ligne, Sévérité, Description, Correction.
3. Réponds dans le chat avec un bref résumé des résultats et un lien Markdown cliquable vers le rapport généré.
