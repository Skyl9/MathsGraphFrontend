import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    fr: {
        translation: {
            "app": {
                "title": "MathGraph",
                "search": "Rechercher un concept...",
                "login": "Connexion",
                "register": "S'inscrire"
            },
            "nav": {
                "home": "Accueil",
                "graph": "Le Graphe",
                "mathematicians": "Mathématiciens",
                "categories": "Catégories"
            },
            "theme": {
                "light": "Mode Clair",
                "dark": "Mode Sombre"
            }
        }
    },
    en: {
        translation: {
            "app": {
                "title": "MathGraph",
                "search": "Search for a concept...",
                "login": "Login",
                "register": "Sign up"
            },
            "nav": {
                "home": "Home",
                "graph": "The Graph",
                "mathematicians": "Mathematicians",
                "categories": "Categories"
            },
            "theme": {
                "light": "Light Mode",
                "dark": "Dark Mode"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "fr",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;