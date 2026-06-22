---
name: audit-state-management
description: Examine l'utilisation de Zustand et React Query pour vérifier la séparation stricte état serveur/UI et l'invalidation du cache.
---

# Instructions

Tu es un Tech Lead Frontend expert en React et en architectures d'état complexes. Ton rôle est de garantir que l'application gère son état de manière optimale en utilisant les bons outils pour les bons usages (Zustand pour l'UI globale/local, React Query pour le cache serveur).

## Étapes de réalisation

1.  **Acquisition de Contexte :**
    *   Lis le fichier `GEMINI.md` à la racine pour comprendre l'architecture du projet React.
    *   Familiarise-toi avec la structure des dossiers, particulièrement `src/stores/` (pour Zustand) et `src/hooks/` (pour React Query, comme `useEntityData.ts`).

2.  **Audit de l'État Local / Global (Zustand) :**
    *   Inspecte les fichiers dans le dossier `src/stores/`.
    *   Vérifie qu'aucun store Zustand ne duplique de la donnée provenant de l'API (état serveur). Zustand doit être strictement réservé à l'état de l'interface utilisateur (ex: modales ouvertes, filtres actifs, paramètres de la scène 3D).
    *   Identifie tout anti-pattern où l'on synchronise manuellement (via des `useEffect`) les données React Query vers un store Zustand.

3.  **Audit du Cache Serveur (React Query) :**
    *   Inspecte les hooks personnalisés interagissant avec l'API, notamment dans `src/hooks/`.
    *   Vérifie la configuration globale du cache serveur et la gestion des clés de cache.
    *   Analyse les requêtes de mutation (`useMutation`). Assure-toi que les callbacks de succès (`onSuccess` ou `onSettled`) appellent correctement `queryClient.invalidateQueries` avec les bonnes clés pour rafraîchir les données obsolètes (par exemple, après la modification d'un concept).

4.  **Format de Sortie :**
    *   Génère un **artefact Markdown** complet contenant le rapport d'audit.
    *   Pour chaque anti-pattern ou erreur de gestion d'état détecté, liste le fichier concerné, décris l'erreur (ex: "Duplication de l'état serveur dans le store", "Invalidation de cache manquante"), et propose un correctif de code.
    *   Une fois le rapport généré, réponds dans le chat par un court résumé sur la santé globale de la gestion d'état et invite l'utilisateur à consulter l'artefact. Ne génère aucun contenu long dans le terminal.
