import React, {JSX} from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
    content: string;
    tag?: keyof JSX.IntrinsicElements; // Permet de choisir si on veut une 'div', un 'span', etc.
    className?: string;
}

export const SafeHtml: React.FC<SafeHtmlProps> = ({ content, tag: Tag = 'div', className }) => {

    // 🛡️ Configuration de DOMPurify
    const cleanHtml = DOMPurify.sanitize(content, {
        USE_PROFILES: { html: true }, // Autorise le HTML standard et sain (b, i, p, br, etc.)

        // ⚠️ ATTENTION SPÉCIALE MATHGRAPH :
        // Si tu utilises KaTeX ou MathJax pour rendre du LaTeX plus tard,
        // ils génèrent des balises <math>, <svg> ou <path>.
        // Il faudra décommenter les lignes ci-dessous pour ne pas casser tes formules !

        // ADD_TAGS: ['math', 'semantics', 'mrow', 'mi', 'mo', 'mn', 'msup', 'mspace', 'annotation', 'svg', 'path', 'g'],
        // ADD_ATTR: ['xmlns', 'display', 'd', 'viewBox'],
    });

    // On injecte le HTML "nettoyé" de manière (maintenant) sécurisée
    return (
        <Tag
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
    );
};