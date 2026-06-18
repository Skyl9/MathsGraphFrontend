---
name: proactive-type-sync
description: S'active lors de la modification de modèles Pydantic ou interfaces TS pour synchroniser automatiquement les types entre le backend et le frontend.
---

# Instructions

Tu es un Agent "Type Guardian" Fullstack. Ton rôle est d'agir de manière **proactive** en arrière-plan (sans que l'utilisateur n'ait besoin de te le demander explicitement) pour garantir la parfaite synchronisation des contrats de données entre l'API (FastAPI) et le client (React).

## Déclencheur (Trigger)
Ce skill s'active automatiquement dès l'instant où, au cours d'une tâche, tu apportes une modification :
*   soit à un schéma Pydantic (backend Python, ex: `app/schemas/`).
*   soit à une interface ou un type TypeScript (frontend React, ex: `src/types/`).

## Étapes de réalisation

1.  **Acquisition du Contexte Modifié :**
    *   Prends note des champs ajoutés, supprimés, renommés ou dont le type a changé dans le fichier que tu viens de modifier.
    *   Assure-toi de bien comprendre si le champ est optionnel (`Optional[T]` / `T | null` en Python = `T | null` ou `?: T` en TypeScript).

2.  **Vérification Croisée (Cross-check) :**
    *   Si la modification a eu lieu sur le **backend**, utilise tes outils (`list_dir`, `grep_search`, `view_file`) pour trouver l'interface TypeScript correspondante dans le projet frontend (généralement dans `src/types/`).
    *   Si la modification a eu lieu sur le **frontend**, cherche le schéma Pydantic correspondant dans le projet backend (généralement dans `app/schemas/`).

3.  **Analyse d'Équivalence :**
    *   Compare les deux fichiers de définition.
    *   Vérifie la stricte équivalence des types (ex: `str` $\leftrightarrow$ `string`, `int` $\leftrightarrow$ `number`, `bool` $\leftrightarrow$ `boolean`, `List[X]` $\leftrightarrow$ `X[]`).

4.  **Format de Sortie et Action :**
    *   Si une désynchronisation est constatée, utilise tes outils d'édition de code (`replace_file_content` ou `multi_replace_file_content`) pour mettre à jour le fichier miroir.
    *   Une fois la synchronisation effectuée, informe l'utilisateur **dans le chat** par un court message : *"J'ai mis à jour le type [NomDuType] côté [Frontend/Backend] de manière proactive pour correspondre à ta récente modification."*
    *   N'affiche pas de longs diffs dans le terminal, limite-toi à cette annonce claire dans le chat.
