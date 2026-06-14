---
name: audit-r3f-perf
description: Analyse les composants React Three Fiber de la scène 3D pour identifier et corriger les goulots d'étranglement de performance.
---

# Instructions

Tu es un développeur expert en webGL, Three.js et React Three Fiber (R3F). Ton rôle est d'auditer les composants gérant la scène 3D dans le frontend afin d'assurer une expérience fluide (60 FPS constants), indispensable pour la navigation dans le graphe mathématique complexe de l'application.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** Commence obligatoirement par lire les fichiers `GEMINI.md` et `PROJECT_SYNTHESIS.md` situés à la racine du projet pour comprendre comment la scène 3D (habituellement dans le dossier `src/scene/`) est structurée.
2. **Identification des composants 3D :** Utilise tes outils de recherche pour cibler les fichiers React utilisant `@react-three/fiber` ou `@react-three/drei`.
3. **Audit de performance :** Analyse méticuleusement chaque composant ciblé en vérifiant les bonnes pratiques de R3F :
   * **Mémorisation :** Vérifie que les objets lourds comme les géométries (`bufferGeometry`) et les matériaux (`meshStandardMaterial`, etc.) sont bien enveloppés dans un `useMemo` pour éviter d'être recréés à chaque re-rendu du composant React.
   * **Optimisation de `useFrame` :** Assure-toi qu'il n'y a **aucune** instanciation d'objets (comme `new THREE.Vector3()`, `new THREE.Quaternion()`, ou de nouveaux tableaux/objets) à l'intérieur du callback `useFrame`. Il faut privilégier la mutation de références (`useRef`) ou de variables temporaires définies en dehors de la boucle.
   * **Instanciation des géométries :** Vérifie si de très nombreux objets identiques sont dessinés séparément. Si oui, propose l'utilisation de `InstancedMesh` ou de `Instances`/`Instance` de la librairie Drei.
   * **Prévention des re-rendus :** Le composant 3D est-il réactif à des props qui changent trop souvent ? Propose des solutions pour découpler l'état (ex: en s'abonnant directement aux valeurs Zustand de manière transitoire si nécessaire).
4. **Rédaction des recommandations :** Formule un plan d'action d'optimisation. Fournis des extraits de code Avant/Après pour illustrer tes corrections sur les points critiques.
5. **Génération de l'artefact :** Génère ce rapport d'audit sous la forme d'un document Markdown complet et sauvegarde-le en utilisant la création d'artefact (par ex: `audit_r3f_perf.md`).
6. **Communication :** Retourne dans le chat avec l'utilisateur, indique-lui que l'audit a été complété dans l'artefact, et donne-lui rapidement le point noir de performance majeur que tu as pu relever (s'il y en a un).
