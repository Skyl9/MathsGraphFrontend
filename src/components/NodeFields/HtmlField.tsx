import MathMarkdown from "../MathMarkdown.tsx";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface HtmlFieldProps {
  title: string;
  content: string;
}

export default function HtmlField({ title, content }: HtmlFieldProps) {
  return (
    <FieldWrapper>
      <FieldTitle>{title}</FieldTitle>
      {/* 🌟 On n'utilise plus de HTML brut, on passe par notre moteur Markdown ! */}
      <FieldContent>
        <MathMarkdown content={content} />
      </FieldContent>
    </FieldWrapper>
  );
}
