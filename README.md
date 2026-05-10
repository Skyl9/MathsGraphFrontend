# MathGraph - Frontend

MathGraph est une application web interactive et collaborative permettant d'explorer visuellement l'univers mathématique. Elle représente les théorèmes, lemmes, axiomes et concepts sous forme d'un graphe 3D interactif, révélant ainsi les connexions et implications entre les différentes branches des mathématiques.

Ce dépôt contient le code source de l'interface utilisateur (Frontend).

## Fonctionnalités Principales

* **Visualisation 3D Interactive :** Exploration fluide du graphe des concepts mathématiques grâce à un moteur 3D performant (Three.js / React Three Fiber).
* **Édition de Formules (LaTeX) :** Éditeur de texte riche intégré avec rendu MathJax en temps réel pour rédiger des théorèmes et des démonstrations de manière lisible.
* **Encyclopédie Collaborative :** * Ajout et modification de concepts, théorèmes, relations, sources et tags.
    * Historique complet des versions avec comparaison des différences (diff-view).
    * Système de restauration (Rollback) en cas d'erreur.
* **Espace Communautaire :** Système d'authentification (JWT), profils utilisateurs, gestion des favoris et système de commentaires par champ.
* **Panneau d'Administration :** Interface dédiée aux administrateurs/modérateurs pour gérer les utilisateurs, surveiller les contenus et ajuster les paramètres globaux.
* **Recherche & Filtrage :** Barre de recherche avancée et filtres par type (Axiome, Théorème, Lemme, etc.).
* **Mode Sombre / Clair :** Interface utilisateur adaptative avec Material-UI.

## Stack Technique

Ce projet utilise des technologies modernes axées sur la performance et le typage strict :

* **Cœur :** React 19, TypeScript
* **Outil de Build :** Vite (Remplacement de Create React App)
* **3D & Rendu :** Three.js, React Three Fiber, React Three Drei
* **UI & Styles :** Material-UI (MUI v7), Emotion, Framer Motion, GSAP
* **Édition & Typographie :** React-Quill-new, Better-React-MathJax, DOMPurify (Sécurisation XSS)
* **Routage :** React Router DOM v7
* **Gestion du temps :** Day.js

## 🚀 Installation et Lancement en Local

### Prérequis
* **Node.js** : Version 20.x recommandée.
* **npm** : Version 9 ou supérieure.

### Étapes

1. **Cloner le dépôt :**
   ```bash
   git clone [https://github.com/votre-utilisateur/maths_graph_typescript.git](https://github.com/votre-utilisateur/maths_graph_typescript.git)
   cd maths_graph_typescript
2. **Installer les dépendances :**

```Bash
npm install
```
3. **Configurer les variables d'environnement :**

Créez un fichier ```.env``` à la racine du projet en vous basant sur le modèle suivant :

```
VITE_BACKEND_LINK=[http://127.0.0.1:8000](http://127.0.0.1:8000)
VITE_PORT=8000
```
4. **Lancer le serveur de développement :**

```Bash
npm start
# ou npm run dev (selon vos alias)
```
L'application sera accessible sur ```http://localhost:8000```.

# 🐳 Déploiement avec Docker
Le projet inclut un Dockerfile optimisé (Multi-stage build) pour compiler l'application avec Node.js et la servir via Nginx.

1. Construire l'image Docker :

```Bash
docker build --build-arg VITE_BACKEND_LINK=[https://api.votre-domaine.com](https://api.votre-domaine.com) -t mathgraph-frontend .
```
2. Lancer le conteneur :
```Bash
docker run -p 8080:8080 -d mathgraph-frontend
```
# 🤝 Contribuer

Les contributions sont les bienvenues ! Pour proposer une amélioration :

1. Vérifiez la page "Contribuer" (/contribution) sur le site pour connaître les bonnes pratiques.

2. Forkez le projet.

3. Créez une branche pour votre fonctionnalité (git checkout -b feature/ma-nouvelle-fonctionnalite).

4. Commitez vos changements (git commit -m 'Ajout d'une nouvelle fonctionnalité').

5. Poussez vers la branche (git push origin feature/ma-nouvelle-fonctionnalite).

6. Ouvrez une Pull Request.

En cas de bug rencontré, n'hésitez pas à ouvrir une Issue sur ce dépôt !