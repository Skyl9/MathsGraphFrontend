/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_LINK: string;
  readonly VITE_APP_ENV?: string;
  // Ajouter d'autres variables d'environnement VITE_ ici
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
