#!/bin/sh
# Ce script crée le fichier de configuration Javascript au démarrage du conteneur

echo "window.__RUNTIME_CONFIG__ = {" > /usr/share/nginx/html/env-config.js
echo "  VITE_BACKEND_LINK: \"${VITE_BACKEND_LINK}\"," >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js

echo "Configuration Runtime générée avec succès !"