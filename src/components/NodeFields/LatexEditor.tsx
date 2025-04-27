import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Styles pour l'éditeur
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Box, Typography } from "@mui/material";
import "../LatexEditor.css";

// Fonction pour insérer du LaTeX
const insertLatex = (quill: Quill) => {
    if (!quill) return;

    const latexTemplate = `\\(\\)`; // Exemple de texte LaTeX
    const range = quill.getSelection(); // Position du curseur
    if (range) {
        quill.insertText(range.index, latexTemplate); // Insérer le texte
        quill.setSelection(range.index + latexTemplate.length); // Placer le curseur après
    }
};

interface LatexEditorProps {
    text: string; // Texte initial
    onChange: (latex: string) => void; // Callback pour envoyer les modifications
}

const LatexEditor: React.FC<LatexEditorProps> = ({ text, onChange }) => {
    const [latex, setLatex] = useState<string>(text);
    const quillRef = useRef<ReactQuill | null>(null); // Référence pour accéder à Quill

    // Configuration MathJax
    const mathJaxConfig = {
        loader: { load: ["input/asciimath", "output/chtml"] },
        tex: { inlineMath: [["\\(", "\\)"], ["$", "$"]] }, // Délimiteurs inline
    };

    return (
        <MathJaxContext config={mathJaxConfig}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    width: "100%",
                    height: "80vh",
                    padding: 2,
                }}
            >
                {/* Partie Édition */}
                <Box
                    sx={{
                        flex: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        padding: 2,
                        backgroundColor: "#fff",
                    }}
                >
                    <Typography variant="h6" mb={2} textAlign="center">
                        Éditeur LaTeX
                    </Typography>
                    <ReactQuill
                        ref={quillRef} // Référence à Quill
                        value={latex}
                        onChange={(value) => {
                            setLatex(value); // Met à jour l'état local
                            onChange(value); // Notifie le parent des modifications
                        }}
                        placeholder="Écrivez votre contenu LaTeX ici…"
                        modules={{
                            toolbar: {
                                container: [
                                    // Barre d'outils
                                    ["bold", "italic", "underline"], // Boutons standard
                                    [{ header: [1, 2, false] }], // Titres h1, h2
                                    [{ list: "ordered" }, { list: "bullet" }], // Listes
                                    ["link", "image"], // Liens, images
                                    ["code-block"], // Bloc de code
                                    ["latex"], // Bouton personnalisé LaTeX
                                ],
                                handlers: {
                                    latex: () => {
                                        // Logique du bouton LaTeX
                                        const quill = quillRef.current?.getEditor();
                                        insertLatex(quill!); // Insérer le modèle LaTeX
                                    },
                                },
                            },
                        }}
                        style={{
                            height: "calc(100% - 50px)", // Ajuste la hauteur
                        }}
                    />
                </Box>

                {/* Partie Rendu */}
                <Box
                    sx={{
                        flex: 1,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        padding: 2,
                        backgroundColor: "#f9f9f9",
                        overflowY: "auto",
                    }}
                >
                    <Typography variant="h6" mb={2} textAlign="center">
                        Rendu MathJax
                    </Typography>
                    <MathJax>
                        <div dangerouslySetInnerHTML={{ __html: latex }} />
                    </MathJax>
                </Box>
            </Box>
        </MathJaxContext>
    );
};

export default LatexEditor;