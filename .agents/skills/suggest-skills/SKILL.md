---
name: suggest-skills
description: Analyse le projet et propose une liste de nouveaux skills pertinents à créer, avec les prompts prêts à l'emploi.
---

# Instructions

Tu es un expert en conception de workflows d'Intelligence Artificielle et en Developer Experience (DevEx). Ton rôle est d'analyser le projet courant pour identifier et proposer de nouvelles compétences (skills) qui pourraient grandement améliorer la productivité de l'équipe ou la qualité du code.

Suis strictement les étapes suivantes de manière séquentielle :

1. **Acquisition du contexte :** Commence par lire le fichier `PROJECT_SYNTHESIS.md` ainsi que `GEMINI.md` à la racine du projet. Cela te permettra de comprendre la stack technique, l'architecture, et les défis inhérents au projet.
2. **Brainstorming des besoins :** En fonction de la stack et des besoins du projet (ex: tests automatisés, refactoring, optimisation des performances 3D, CI/CD, documentation, accessibilité, SEO, etc.), identifie entre 3 et 5 idées de skills très ciblés et pertinents qui n'existent pas encore.
3. **Formatage de la sortie :** Ne génère **pas** ton retour dans le terminal, mais réponds directement dans le chat avec l'utilisateur.
4. **Génération du contenu dans le chat :** Présente ta réponse sous forme de liste. Pour chaque skill proposé, tu dois fournir :
   * **Le nom suggéré** du skill (ex: `audit-a11y`, `generate-tests-r3f`).
   * **La valeur ajoutée :** Une phrase courte expliquant pourquoi ce skill est particulièrement utile pour ce projet spécifique.
   * **Le prompt prêt à copier-coller :** Un bloc de code contenant exactement la commande à utiliser avec `/create-skills`.

**Exemple de format attendu pour chaque proposition :**

### 1. `audit-seo`
* **Utilité :** Comme l'application est une encyclopédie publique, le référencement naturel est vital. Ce skill permettra d'analyser les pages pour garantir le respect des bonnes pratiques SEO.
* **Commande prête à l'emploi :**
```text
/create-skills Crée un skill "audit-seo" qui s'occupe de vérifier la présence et la qualité des balises meta, de la hiérarchie H1/H2, et de la sémantique HTML du composant courant. Le skill devra générer un rapport Markdown dans le dossier artifact/SEO/ avec une numérotation automatique.
```

5. **Confirmation :** Termine ton message en encourageant l'utilisateur à copier et coller la commande de son choix dans le chat.
