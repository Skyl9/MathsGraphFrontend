# ─── Étape 1 : Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Copie des dépendances en premier (optimise le cache Docker)
COPY package*.json ./
RUN npm ci

# Copie du code source
COPY . .

# Build de production
# VITE_BACKEND_LINK n'est PAS baked-in ici.
# Il est injecté au RUNTIME par env.sh via window.__RUNTIME_CONFIG__.
# Cela permet de changer l'URL du backend sans rebuilder l'image.
RUN npm run build

# ─── Étape 2 : Serveur nginx ──────────────────────────────────────────────────
FROM nginx:alpine

# Configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Application compilée
COPY --from=build /app/dist /usr/share/nginx/html

# Script de génération de env-config.js (exécuté au démarrage du conteneur,
# AVANT que nginx commence à servir des requêtes)
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]