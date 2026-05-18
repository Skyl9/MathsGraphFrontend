# Étape 1 : Le build 
FROM node:20-alpine AS build

ARG VITE_BACKEND_LINK
ARG GENERATE_SOURCEMAP
ARG NODE_ENV

# On crée un fichier .env à l'intérieur du conteneur avec les nouvelles variables VITE
RUN echo "VITE_BACKEND_LINK=$VITE_BACKEND_LINK" >> .env && \
    echo "GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP" >> .env && \
    echo "NODE_ENV=$NODE_ENV" >> .env

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Construire l'application (Vite va générer le dossier /app/dist)
RUN npm run build

# Étape 2 : Le serveur
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# On copie depuis le dossier "dist" (généré par Vite) au lieu de "build"
COPY --from=build /app/dist /usr/share/nginx/html

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]