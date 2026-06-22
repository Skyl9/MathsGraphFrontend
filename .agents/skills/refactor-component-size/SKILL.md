---
name: refactor-component-size
description: Analyse les fichiers du frontend pour identifier les composants trop volumineux (> 250 lignes) et propose un plan de découpage concret en sous-composants, hooks et fichiers de styles.
---
# Instructions

Tu es un **Architecte Frontend Senior** spécialisé en React et en principes SOLID appliqués aux composants UI. Ton rôle est d'identifier les composants "God Components" du projet MathGraph (trop longs, trop de responsabilités) et de proposer un plan de refactorisation concret et progressif qui respecte les conventions architecturales déjà en place.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend : `/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`.
2. Identifie les **patterns de séparation existants** dans le projet en inspectant les fichiers suivants. Ils servent de modèle de référence pour tes propositions :
   - `src/components/GraphHUD.styles.ts` — Exemple de fichier de styles isolé via `styled()` de MUI.
   - `src/components/HomePage.styles.tsx` — Autre exemple de styles isolés.
   - `src/components/Menu.styles.ts` — Pattern supplémentaire.
   - `src/components/NodeDetails.styles.ts` — Pattern supplémentaire.
3. Note que le projet utilise :
   - **MUI `styled()`** et **`sx` prop** pour le styling.
   - **Framer Motion** pour les animations.
   - **Hooks dédiés** (ex: `useMenuLogic.ts`, `useEditModalLogic.ts`) pour isoler la logique de certains composants.

## 2. Détection des composants volumineux

Scanne les trois dossiers suivants du frontend :
- `src/components/` (et ses sous-dossiers)
- `src/pages/`
- `src/scene/`

Pour chaque fichier `.tsx` ou `.ts`, mesure :
- **Le nombre de lignes** du fichier.
- **La taille en octets** du fichier.

Signale tout fichier qui dépasse **au moins un** des seuils suivants :
- **> 250 lignes**
- **> 8 Ko (8192 octets)**

## 3. Analyse de complexité de chaque fichier signalé

Pour chaque fichier dépassant les seuils, lis son contenu et analyse les axes de complexité suivants :

### 3.1 Responsabilités multiples
- **Identifie** les blocs de logique distincts au sein du composant. Un composant devrait idéalement n'avoir qu'une seule responsabilité.
- **Exemples typiques de responsabilités mélangées :**
  - Logique d'état (state management) mélangée avec le rendu JSX.
  - Logique de transformation de données mélangée avec la présentation.
  - Gestion de formulaires (validation, soumission) mélangée avec l'affichage.
  - Gestion d'événements complexe (interactions 3D, raccourcis clavier) dans le corps du composant.

### 3.2 Styles inline volumineux
- **Identifie** les objets `sx={{...}}` ou les blocs `styled()` définis directement dans le fichier du composant qui alourdissent le JSX.
- **Quantifie** le nombre de lignes occupées par les styles inline vs. la logique et le rendu.

### 3.3 Sous-sections JSX extractibles
- **Identifie** les blocs de JSX qui pourraient être extraits en sous-composants autonomes (ex: un header, une section de détails, une liste de boutons d'action, un formulaire imbriqué).
- **Critère :** Si un bloc JSX fait plus de 30 lignes et possède sa propre logique conditionnelle ou sa propre gestion d'état, il est candidat à l'extraction.

### 3.4 Hooks et logique extractibles
- **Identifie** la logique qui pourrait être isolée dans un hook dédié (par analogie avec `useMenuLogic.ts` et `useEditModalLogic.ts`).
- **Critère :** Si un composant possède plus de 3 `useState` + `useEffect` liés à une même fonctionnalité, cette logique est candidate à l'extraction en hook.

## 4. Plan de découpage pour chaque composant

Pour chaque fichier signalé, génère un **plan de refactorisation concret** comprenant :

### 4.1 Arborescence proposée
Présente la structure de fichiers **avant** et **après** :
```
Avant :
  src/components/MyComponent.tsx (450 lignes)

Après :
  src/components/MyComponent/
  ├── MyComponent.tsx (150 lignes - composant principal, orchestrateur)
  ├── MyComponent.styles.ts (80 lignes - styles extraits)
  ├── MyComponentHeader.tsx (60 lignes - sous-composant)
  ├── MyComponentList.tsx (90 lignes - sous-composant)
  └── useMyComponentLogic.ts (70 lignes - hook de logique métier)
```

### 4.2 Répartition des responsabilités
Pour chaque fichier créé, décris en 1-2 phrases ce qu'il contient et pourquoi il a été extrait.

### 4.3 Snippet illustratif
Fournis un extrait de code montrant comment le composant principal "orchestre" les sous-composants après refactorisation :
```tsx
// MyComponent.tsx (après refactorisation)
import { useMyComponentLogic } from './useMyComponentLogic';
import { Header } from './MyComponentHeader';
import { List } from './MyComponentList';
import { Container, Wrapper } from './MyComponent.styles';

export const MyComponent = () => {
  const { data, handlers } = useMyComponentLogic();
  return (
    <Container>
      <Header title={data.title} />
      <List items={data.items} onItemClick={handlers.handleClick} />
    </Container>
  );
};
```

### 4.4 Estimation de l'effort
Pour chaque composant, estime l'effort de refactorisation :
- ⚡ **Facile** (< 1h) : Extraction de styles uniquement, ou extraction d'un seul sous-composant sans changement de logique.
- 🔧 **Moyen** (1-3h) : Extraction de 2+ sous-composants et/ou d'un hook dédié.
- 🏗️ **Complexe** (> 3h) : Restructuration profonde, changement de l'arborescence de fichiers, risque de régression sur les interactions (3D, animations).

## 5. Génération du Rapport

1. Inspecte le dossier `artifact/Refactoring/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/Refactoring/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier.
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Nombre de fichiers dépassant les seuils, volume total de code concerné, et top 3 des refactorisations les plus impactantes.
   - **Tableau de synthèse** : Colonnes : Fichier, Lignes, Taille, Problème principal, Effort estimé, Priorité.
   - **Plans de découpage détaillés** : Une section par fichier, avec l'arborescence avant/après, la répartition des responsabilités, et le snippet illustratif.
3. Réponds dans le chat avec un bref résumé des résultats et un lien Markdown cliquable vers le rapport généré.
