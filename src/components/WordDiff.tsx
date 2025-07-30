// components/WordDiff.tsx
import React from 'react';
import { diffWordsWithSpace } from 'diff';
import {Typography} from "@mui/material";

interface WordDiffProps {
    oldText: string;
    newText: string;
}

export const WordDiff: React.FC<WordDiffProps> = ({ oldText, newText }) => {
    const parts = diffWordsWithSpace(oldText, newText);
    return (
        <Typography component="span">
            {parts.map((part, i) => {
                if (part.added) {
                    return (
                        <span key={i} style={{ backgroundColor: '#e6ffed' }}>
              {part.value}
            </span>
                    );
                }
                if (part.removed) {
                    return (
                        <span key={i} style={{ backgroundColor: '#ffeef0', textDecoration: 'line-through' }}>
              {part.value}
            </span>
                    );
                }
                return <span key={i}>{part.value}</span>;
            })}
        </Typography>
    );
};