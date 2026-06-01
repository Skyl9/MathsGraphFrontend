#!/bin/sh
# Ce script est exécuté par nginx au démarrage du conteneur (docker-entrypoint.d/).
# Il génère /usr/share/nginx/html/env-config.js qui expose les variables d'environnement
# Railway au navigateur via window.__RUNTIME_CONFIG__.
# Cela permet de modifier VITE_BACKEND_LINK sans rebuilder l'image Docker.

set -e

TARGET="/usr/share/nginx/html/env-config.js"

# ─── Validation de VITE_BACKEND_LINK ─────────────────────────────────────────
if [ -z "$VITE_BACKEND_LINK" ]; then
  echo "[env.sh] ERREUR : VITE_BACKEND_LINK n'est pas défini !"
  echo "[env.sh] Définissez cette variable dans Railway > Variables du service frontend."
  # On génère quand même le fichier avec une valeur vide pour éviter un crash JS
  VITE_BACKEND_LINK=""
fi

# ─── Auto-correction : ajouter https:// si le protocole est manquant ─────────
case "$VITE_BACKEND_LINK" in
  http://*|https://*)
    # Protocole présent, rien à faire
    ;;
  "")
    # Vide, on laisse tel quel
    ;;
  *)
    echo "[env.sh] ATTENTION : VITE_BACKEND_LINK ne commence pas par http(s)://"
    echo "[env.sh] Valeur reçue : '$VITE_BACKEND_LINK'"
    VITE_BACKEND_LINK="https://$VITE_BACKEND_LINK"
    echo "[env.sh] Corrigé automatiquement en : '$VITE_BACKEND_LINK'"
    ;;
esac

# ─── Génération de env-config.js ─────────────────────────────────────────────
cat > "$TARGET" << EOF
// Généré automatiquement au démarrage du conteneur — NE PAS ÉDITER
window.__RUNTIME_CONFIG__ = {
  VITE_BACKEND_LINK: "${VITE_BACKEND_LINK}"
};
EOF

echo "[env.sh] env-config.js généré avec succès (VITE_BACKEND_LINK=${VITE_BACKEND_LINK})"