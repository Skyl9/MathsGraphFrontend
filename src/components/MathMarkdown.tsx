import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

// On autorise un peu plus souple ici pour rattraper les erreurs
interface MathMarkdownProps {
  content: string | number | null | undefined;
}

const mathSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [
      ...(defaultSchema.attributes?.div || []),
      ["className", "math", "math-display"],
    ],
    span: [
      ...(defaultSchema.attributes?.span || []),
      ["className", "math", "math-inline"],
    ],
  },
};

export default function MathMarkdown({ content }: MathMarkdownProps) {
  const safeContent = content != null ? String(content) : "";

  // Si c'est vide, on ne rend rien
  if (!safeContent) return null;

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeSanitize, mathSchema], rehypeKatex]}
      >
        {safeContent}
      </ReactMarkdown>
    </div>
  );
}
