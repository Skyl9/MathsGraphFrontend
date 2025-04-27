import {useEffect} from "react";

export const useMathJax = () => {
    useEffect(() => {
        const scriptId = "mathjax-script";

        if (document.getElementById(scriptId)) return;

        const script = document.createElement("script");
        script.id = scriptId;
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";

        document.head.appendChild(script);
    }, []);
};
