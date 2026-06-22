---
name: audit-opengraph-sharing
description: Analyse les pages frontend pour s'assurer que les balises OpenGraph et Twitter Cards sont dynamiquement et correctement injectées avant le rendu client.
---

# Instructions

Tu es un **Ingénieur Frontend Expert en SEO et Social Graph**. Ton rôle est d'auditer l'application MathGraph pour t'assurer que lorsqu'un utilisateur partage un concept (ex: sur Twitter, LinkedIn, Discord ou iMessage), les robots d'indexation sociaux génèrent un aperçu riche (Rich Card) avec un titre, une description et une image adéquate, ce qui est vital pour la viralité d'une encyclopédie.

Suis strictement les étapes suivantes de manière séquentielle :

## 1. Acquisition de Contexte

1. Lis le fichier `GEMINI.md` du frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/GEMINI.md`).
2. Identifie les dossiers clés : `src/pages/` (là où les routes sont gérées) et cherche la présence d'une librairie de gestion du `<head>` comme `react-helmet`, `react-helmet-async` ou l'API native de React 19 pour les métadonnées.
3. Repère le fichier principal HTML (`index.html`) pour vérifier les balises par défaut.

## 2. Audit de l'Injection Dynamique des Balises

Scanne les composants représentant des pages (ex: `ConceptPage`, `GraphPage`, `HomePage`) :
1. **Présence des composants de Head :** Vérifie que chaque page injecte des balises `<meta>` dynamiques (via Helmet ou similaire) qui correspondent au contenu affiché.
2. **Balises OpenGraph obligatoires :** Cherche la présence systématique des attributs suivants :
   - `og:title` (Le nom du concept ou de la page)
   - `og:description` (Un extrait du contenu)
   - `og:image` (L'URL absolue vers une image représentative ou un rendu généré dynamiquement)
   - `og:url` (L'URL canonique)
   - `og:type` (souvent `article` ou `website`)
3. **Balises Twitter Cards :** Vérifie la présence de `twitter:card` (souvent `summary_large_image`), `twitter:title`, `twitter:description` et `twitter:image`.

## 3. Analyse des Pièges liés aux SPA (Single Page Applications)

Étant donné que l'application est une SPA (Vite + React) :
1. **Avertissement SPA :** Garde à l'esprit que les robots de réseaux sociaux (Facebook Crawler, TwitterBot, DiscordBot) **n'exécutent souvent pas le JavaScript**. Si les balises `<meta>` sont uniquement injectées côté client par React après le chargement, les partages afficheront la page vide.
2. **Stratégies de SSR / Pre-rendering :** Cherche des preuves d'utilisation d'un mécanisme de pré-rendu (comme Vite SSR, Prerender.io, ou des fonctions Cloud/Edge dédiées) qui intercepte les requêtes des bots pour injecter les bonnes balises HTML *avant* l'envoi au navigateur.
3. Si aucune stratégie SSR n'est en place, signale-le comme un point bloquant majeur pour la viralité.

## 4. Génération du Rapport Social Graph

1. Inspecte le dossier `artifact/SEO/` du projet frontend (`/Users/tristanrigaud-humbert/WebstormProjects/maths_graph_typescript/artifact/SEO/`). S'il n'existe pas, crée-le. Détermine le prochain numéro logique pour le fichier (ex: si `rapport_01.md` existe, le tien sera `rapport_02.md`).
2. Crée le fichier Markdown numéroté avec la structure suivante :
   - **Résumé exécutif** : Bilan de la "Shareability" du projet (L'application est-elle prête pour la viralité sociale ?).
   - **Analyse des Pages (Client-side)** : Tableau listant les pages et indiquant quelles balises OG/Twitter sont manquantes dans le code React.
   - **Problématique d'Indexation (SPA)** : Analyse approfondie expliquant pourquoi l'injection côté client ne suffit pas pour les réseaux sociaux.
   - **Recommandations Architecturales** : Propositions concrètes pour résoudre le problème (ex: Edge Functions, SSR léger, ou bots proxy) avec des snippets d'implémentation.
3. Réponds dans le chat avec un bref résumé de l'état actuel des balises de partage et un lien Markdown cliquable vers le rapport généré.
