import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import 'katex/dist/katex.min.css';

// On autorise un peu plus souple ici pour rattraper les erreurs
interface MathMarkdownProps {
    content: string | number | null | undefined;
}

export default function MathMarkdown({ content }: MathMarkdownProps) {
    const safeContent = content != null ? String(content) : "";

    // Si c'est vide, on ne rend rien
    if (!safeContent) return null;

    return (
        <div className="markdown-content">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {safeContent}
            </ReactMarkdown>
        </div>
    );
}