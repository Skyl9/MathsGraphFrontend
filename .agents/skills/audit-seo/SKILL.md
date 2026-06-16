---
name: audit-seo
description: Analyse les pages du projet React pour vérifier le respect des bonnes pratiques SEO (balises meta, hiérarchie H1/H2, sémantique HTML) et génère un rapport.
---

# Instructions

Tu es un expert en référencement naturel (SEO) et un développeur frontend React chevronné. Ton rôle est d'analyser le code source du projet (une encyclopédie mathématique publique) pour garantir une visibilité et une indexation maximales par les moteurs de recherche.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** Commence par lire les fichiers `GEMINI.md` et `PROJECT_SYNTHESIS.md` à la racine du projet pour bien comprendre la stack technique et les spécificités de l'application.
2. **Identification des cibles :** Recherche les composants de page principaux (qui se trouvent généralement dans le dossier `src/pages/` ou associés au routeur).
3. **Analyse de l'existant :** Pour les composants de page principaux, analyse le code source et audite les points suivants :
   * **Gestion des métadonnées :** Comment sont gérés le `<title>` et les balises `<meta>` (description, OpenGraph, Twitter Cards) ? Y a-t-il utilisation d'une librairie dédiée comme React Helmet ?
   * **Hiérarchie des titres :** Chaque page possède-t-elle un `<h1>` unique et descriptif ? Les sous-titres (`<h2>`, `<h3>`) suivent-ils une structure logique et non "sautée" ?
   * **Sémantique HTML5 :** Le code utilise-t-il les bonnes balises (`<main>`, `<article>`, `<nav>`, `<aside>`, etc.) plutôt que de simples `<div>` ?
   * **Optimisation des liens et médias :** Les attributs `alt` des images sont-ils présents ? Les liens (`<a>` ou composants équivalents de React Router) sont-ils configurés correctement pour le crawl ?
4. **Génération de recommandations :** En te basant sur tes observations, formule des recommandations d'amélioration techniques précises, concrètes et applicables dans le contexte d'une SPA React (par ex., mise en place de rendu côté serveur si nécessaire, ou l'ajout d'une librairie de gestion de la balise head).
5. **Génération du fichier d'artefact :**
   * Inspecte le dossier `artifact/SEO/` à la racine du projet (crée-le s'il n'existe pas).
   * Détermine le prochain numéro de fichier disponible (par exemple, si `recommendation_01.md` existe, le tien sera `recommendation_02.md`). S'il n'y a aucun fichier, commence à `recommendation_01.md`.
   * Rédige et sauvegarde ton rapport détaillé au format Markdown dans ce nouveau fichier.
6. **Communication :** Réponds à l'utilisateur dans le chat en lui présentant un résumé exécutif très concis de ton audit (les 2-3 points les plus critiques) et indique-lui que le rapport complet est disponible sous forme d'artefact.
