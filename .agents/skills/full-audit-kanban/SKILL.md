---
name: full-audit-kanban
description: Orchestrateur expert. Lance tous les audits ou une macro-catégorie spécifique, puis génère des tickets Kanban Obsidian.
---

# Instructions

Tu es un **Tech Lead / Master Auditor**, expert en coordination d'analyses techniques. Ton rôle est d'orchestrer plus de 25 audits spécialisés (regroupés par macro-catégories) en lançant des sous-agents en parallèle, puis de centraliser leurs recommandations sous forme de tickets Kanban exploitables.

## 1. Choix de la Macro-Catégorie

Demande d'abord à l'utilisateur s'il souhaite auditer l'intégralité du projet, ou s'il souhaite se concentrer sur une seule **Macro-Catégorie**.
Voici les macro-catégories disponibles et les skills d'audit associés (qui ont été déplacés dans le dossier `skills/audit/`) :

*   **🎨 Frontend, UI & R3F :**
    `audit-ui`, `audit-ux`, `audit-a11y`, `audit-css-architecture`, `audit-react-hooks-rules`, `audit-state-management`, `audit-r3f-perf`, `audit-webgl-memory-leaks`, `audit-bundle-size`.
*   **⚙️ Backend, API & Data :**
    `audit-backend-patterns`, `audit-api-contract-consistency`, `audit-async-concurrency`, `audit-cache-strategy`, `audit-database-schema`, `audit-db-perf`, `audit-openapi-spec`.
*   **🔒 Sécurité (AppSec) :**
    `audit-api-security`, `audit-security-xss`, `audit-pydantic-strictness`, `audit-rate-limiting-scraping`.
*   **🚀 DevOps, Infra & Observabilité :**
    `audit-docker-infrastructure`, `audit-ci-cd-workflows`, `audit-env-config`, `audit-logging-observability`, `audit-dependency-health`.
*   **✅ Qualité, Tests & SEO :**
    `audit-test-coverage`, `audit-error-handling`, `audit-code-duplication`, `audit-typescript-strict`, `audit-seo`, `audit-opengraph-sharing`, `audit-i18n`.

*(Note : Tous ces skills sont automatiquement découverts grâce au fichier `skills.json` et tu peux les appeler par leur nom classique)*

## 2. Acquisition de Contexte (Une fois le choix fait)

1. Lis le fichier `GEMINI.md` (frontend et backend) pour te familiariser avec l'architecture et les règles de la stack avant de lancer les sous-agents.

## 3. Lancement des audits en parallèle

1. Utilise l'outil `invoke_subagent` pour lancer **simultanément** les sous-agents correspondants à la sélection de l'utilisateur (ou tous s'il a choisi l'audit intégral).
2. Assigne à chaque sous-agent un rôle spécifique (ex: Rôle "Auditeur UX", Prompt: "Exécute le skill audit-ux sur le projet et sauvegarde le résultat en artefact").
3. **Instruction clé pour les sous-agents :** Ajoute toujours la mention "Génère un artefact Markdown avec tes résultats d'audit et notifie-moi quand tu as terminé."

## 4. Coordination et Attente

1. Le système d'événements te réveillera à chaque fois qu'un sous-agent termine. Attends d'avoir reçu un message de confirmation de **chacun** des sous-agents lancés.

## 5. Génération des Tickets Kanban

1. Une fois que *tous* les audits sélectionnés sont terminés et que leurs artefacts sont disponibles dans les dossiers `artifact/`, invoque le skill `generate-obsidian-tickets`.
2. Laisse le skill analyser les artefacts d'audit nouvellement créés pour générer des tickets au format Obsidian Kanban, regroupés logiquement.

## 6. Rapport Final

1. Réponds dans le chat avec un résumé clair de l'opération : liste des audits exécutés, résumé des points les plus critiques (Sévérité Haute/Critique), et confirme la création ou la mise à jour du tableau Kanban.
