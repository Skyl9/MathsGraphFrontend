import MathMarkdown from "../MathMarkdown.tsx";

interface HtmlFieldProps {
    title: string;
    content: string;
}

export default function HtmlField({ title, content }: HtmlFieldProps) {
    return (
        <div className="html-field-container">
            <h3 className="html-field-title">{title}</h3>
            {/* 🌟 On n'utilise plus de HTML brut, on passe par notre moteur Markdown ! */}
            <div className="html-field-content">
                <MathMarkdown content={content} />
            </div>
        </div>
    );
}