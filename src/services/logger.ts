export const captureException = (error: Error, extra?: Record<string, any>) => {
  // Dans un vrai environnement de production, vous intégreriez Sentry ou LogRocket ici :
  // Sentry.captureException(error, { extra });

  // Pour l'instant, on se contente de le logger plus proprement ou de l'envoyer à un endpoint d'analyse
  console.error("[Centralized Logger] Exception attrapée :", error);
  if (extra) {
    console.error("[Centralized Logger] Contexte :", extra);
  }

  // Optionnel : Envoyer à un endpoint backend si vous avez une route d'analytique
  /*
    fetch(import.meta.env.VITE_BACKEND_LINK + "/admin/analytics/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: error.message, stack: error.stack, extra })
    }).catch(e => console.error("Échec de l'envoi du log", e));
    */
};
