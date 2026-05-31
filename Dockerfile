# Étape 1 : Le build 
FROM node:22-alpine AS build

ARG VITE_BACKEND_LINK
ARG GENERATE_SOURCEMAP
ARG NODE_ENV

# On définit le dossier de travail EN PREMIER
WORKDIR /app

# Maintenant, le .env sera bien créé dans /app/.env
RUN echo "VITE_BACKEND_LINK=$VITE_BACKEND_LINK" >> .env && \
    echo "GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP" >> .env && \
    echo "NODE_ENV=$NODE_ENV" >> .env

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source et build
COPY . .
RUN npm run build

# Étape 2 : Le serveur
FROM nginx:alpine

# Copie de la configuration NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie de l'application compilée
COPY --from=build /app/dist /usr/share/nginx/html

# Script d'environnement au runtime (si tu l'utilises pour remplacer des variables dans le JS)
COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]