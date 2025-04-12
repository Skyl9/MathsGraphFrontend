declare global {
    interface Window {
        MathJax: {
            typesetPromise?: (elements?: (Element | null)[]) => Promise<void>;
        };
    }
}

export {};
