# 🤖 Context Assistant - Frontend (React 19 + Vite)

Ce fichier sert de guide contextuel pour toute IA ou développeur travaillant sur le frontend de MathGraph.

## 🛠 Stack Technique
- **Framework :** React 19 (Migration effectuée depuis CRA).
- **Build Tool :** Vite (Serveur sur port 8000 par défaut).
- **Langage :** TypeScript (Mode strict, TS 5.x+).
- **3D :** React Three Fiber + Drei + GSAP (pour les animations de caméra).
- **UI :** Material UI (MUI v7) + Framer Motion.
- **Mathématiques :** Better-React-MathJax + React-Quill-new.

## 🏗 Architecture & Patterns
- **Hooks Génériques :** Ne pas créer de hooks spécifiques par entité. Utiliser `src/hooks/generic/useEntityData.ts` et `useEntityEdit.ts`. Pour ajouter une entité, mettre à jour `ENTITY_CONFIG` et `FIELDS_GENERATOR_MAP`.
- **Points d'entrée :** `index.html` est à la racine, `src/index.tsx` est le point d'entrée JS.
- **Variables d'environnement :** Toujours utiliser le préfixe `VITE_` et y accéder via `import.meta.env.VITE_...`.

## 🔒 Règles de Sécurité
- **XSS :** Toute donnée rendue via `dangerouslySetInnerHTML` (particulièrement le LaTeX et le texte riche) DOIT être passée dans `DOMPurify.sanitize()`.
- **Authentification :** Le token JWT est stocké dans le `localStorage`. Les services de l'API (`src/services/api.ts`) l'injectent automatiquement.

## 💡 Conseils pour l'IA
- Prioriser le typage strict. Éviter le type `any`.
- Lors de la création de nouveaux composants de formulaire, s'appuyer sur les constantes de `src/constants/editableFields.ts`.