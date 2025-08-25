# Étape 1 : Le build 
# Nous utilisons une image Node.js pour construire notre application 
FROM node:20-alpine AS build 

ARG REACT_APP_BACKEND_LINK
ARG GENERATE_SOURCEMAP
ARG NODE_ENV

# On crée un fichier .env à l'intérieur du conteneur
RUN echo "REACT_APP_BACKEND_LINK=$REACT_APP_BACKEND_LINK" >> .env && \
    echo "GENERATE_SOURCEMAP=$GENERATE_SOURCEMAP" >> .env && \
    echo "NODE_ENV=$NODE_ENV" >> .env

# Définir le répertoire de travail dans le conteneur 
WORKDIR /app 

# Copier les fichiers package.json et package-lock.json pour installer les dépendances 
# Ces fichiers sont copiés en premier pour que Docker puisse les mettre en cache 
# et éviter de réinstaller toutes les dépendances à chaque fois que le code change 
COPY package*.json ./ 

# Installer les dépendances 
RUN npm install 

# Copier le reste des fichiers de l'application 
COPY . . 

# Construire l'application React en production 
RUN npm run build 



# Étape 2 : Le serveur
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080