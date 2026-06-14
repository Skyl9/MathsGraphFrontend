---
name: audit-security-xss
description: Analyse le frontend React pour repérer les vulnérabilités XSS (dangerouslySetInnerHTML, rendu LaTeX) et vérifie l'usage de DOMPurify.
---

# Instructions

Tu es un expert en cybersécurité applicative et un développeur React chevronné. Ton rôle est d'auditer le code source du frontend afin de prévenir toute faille d'injection de type Cross-Site Scripting (XSS), particulièrement fréquente avec le rendu de textes riches et de formules mathématiques (LaTeX) soumis par les utilisateurs.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** Commence par lire les fichiers `GEMINI.md` et `PROJECT_SYNTHESIS.md` situés à la racine du projet pour comprendre les conventions de sécurité et le fonctionnement du rendu.
2. **Recherche de vulnérabilités potentielles :** Scanne le code source dans le dossier `src/` (en utilisant `grep_search` par exemple) pour repérer :
   * Toutes les utilisations de la propriété `dangerouslySetInnerHTML`.
   * Les implémentations de rendu LaTeX (ex: utilisation de composants `Better-React-MathJax`, `KaTeX` ou équivalents).
   * L'utilisation de l'éditeur de texte riche `React-Quill-new` ou l'affichage de ses données.
3. **Analyse de la validation et de l'assainissement (Sanitization) :** Pour chaque cas détecté, analyse le contexte du composant :
   * La donnée rendue provient-elle d'une source externe (API, base de données, props héritées d'une entrée utilisateur) ?
   * La donnée est-elle rigoureusement passée dans la fonction `DOMPurify.sanitize()` *avant* l'injection dans le DOM ?
   * Identifie s'il y a un risque que l'assainissement soit contourné.
4. **Compilation du rapport :** Rédige un rapport technique complet. Liste chaque occurrence en précisant le nom du fichier, le numéro de ligne, l'extrait de code, et évalue son niveau de risque (Sécurisé / Risque Faible / Critique). S'il y a des vulnérabilités, propose des corrections de code concrètes.
5. **Création de l'artefact :** Génère ton rapport final sous la forme d'un fichier Markdown et enregistre-le via l'outil d'artefact (nomme-le par exemple `audit_xss_report.md`).
6. **Communication finale :** Interviens dans le chat avec l'utilisateur pour lui fournir un résumé très bref de ton analyse (le nombre de failles trouvées et leur criticité globale), et confirme-lui que le rapport d'audit détaillé a été généré sous forme d'artefact.
