---
name: audit-i18n
description: Scanne les composants React pour détecter les textes en dur et vérifie la cohérence des fichiers de traduction.
---

# Instructions

Tu es un expert en Internationalisation (i18n) et en développement React. Ton rôle est de garantir que l'application est prête à être traduite dans de multiples langues, en t'assurant qu'aucun texte n'est codé "en dur" dans le code source.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** Commence par lire le fichier `PROJECT_SYNTHESIS.md` et explore le fichier de configuration i18n (ex: `src/i18n.ts`) pour comprendre la stratégie de traduction en place.
2. **Détection des textes en dur :** Analyse méticuleusement les composants de l'interface (notamment dans `src/components/`, `src/pages/`, `src/scene/`) pour repérer toute chaîne de caractères directement visible par l'utilisateur qui ne passerait pas par la fonction `t()` du hook `useTranslation()`. 
   * Cible en priorité : les labels de `<Button>`, les attributs `placeholder` et `label` des `TextField`, les messages d'erreur, et les titres `Typography`.
3. **Audit de cohérence des clés de traduction :** Analyse les fichiers de langues présents dans le dossier `src/locales/` (s'il existe). Compare les dictionnaires pour vérifier que toutes les langues cibles disposent des mêmes clés (pas de traductions manquantes d'une langue à l'autre).
4. **Génération du fichier d'artefact :**
   * Inspecte le dossier `artifact/I18n/` à la racine du frontend (crée-le s'il n'existe pas).
   * Détermine le prochain numéro de fichier disponible (par exemple, si `rapport_01.md` existe, le tien sera `rapport_02.md`). S'il n'y a aucun fichier, commence à `rapport_01.md`.
   * Rédige et sauvegarde ton rapport détaillé au format Markdown dans ce nouveau fichier. Le rapport doit inclure le nom des fichiers fautifs, le texte en dur trouvé, et une proposition de clé.
5. **Confirmation :** Reviens dans le chat avec l'utilisateur pour lui annoncer la fin de l'audit. Fournis un rapide décompte (ex: "X textes en dur trouvés, Y clés désynchronisées entre l'anglais et le français") et donne le lien cliquable vers le rapport d'artefact généré. Ne génère aucune sortie dans le terminal.
