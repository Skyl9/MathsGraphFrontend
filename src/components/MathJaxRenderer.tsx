import React, { useEffect, useRef } from "react";
import { useMathJax } from "../hooks/useMathJax";

type MathJaxRendererProps = {
    content: string;
};

const MathJaxRenderer: React.FC<MathJaxRendererProps> = ({ content }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useMathJax();

    useEffect(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise([containerRef.current]).catch((err: any) =>
                console.error("MathJax rendering error:", err)
            );
        }
    }, [content]);

    return <div ref={containerRef}>{content}</div>;
};

export default MathJaxRenderer;
