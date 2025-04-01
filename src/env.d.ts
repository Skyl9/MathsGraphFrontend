// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        BACKEND_LINK: string;
        GENERATE_SOURCEMAP:boolean;

        // Ajouter d'autres variables d'environnement ici
    }
}
