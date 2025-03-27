import React from "react";
import { MathJax } from "better-react-mathjax";
import { AllNodeData } from "../type";

interface RowProps {
    node: AllNodeData;
    handleEdit: (id: number, field: keyof AllNodeData, value: string) => void;
    saveChanges: (id: number) => void;
    editData: { [key: number]: Partial<AllNodeData> };
    style: React.CSSProperties;
}

const TableRow = React.memo(({ node, handleEdit, saveChanges, editData, style }: RowProps) => {
    return (
        <div className="table-row" style={style}>
            <div className="cell">{node.id}</div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "nom", e.target.innerText)}>
                {editData[node.id]?.nom ?? node.nom}
            </div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "type", e.target.innerText)}>
                {editData[node.id]?.type ?? node.type}
            </div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "enonce", e.target.innerText)}>
                <MathJax inline>{editData[node.id]?.enonce ?? node.enonce}</MathJax>
            </div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "categorie", e.target.innerText)}>
                {editData[node.id]?.categorie ?? node.categorie}
            </div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "mathematicien", e.target.innerText)}>
                {editData[node.id]?.mathematicien ?? node.mathematicien}
            </div>
            <div className="cell" contentEditable onBlur={e => handleEdit(node.id, "demonstration", e.target.innerText)}>
                {editData[node.id]?.demonstration ?? node.demonstration}
            </div>
            <div className="cell">
                <button className="save-button" onClick={() => saveChanges(node.id)}>💾</button>
            </div>
        </div>
    );
});

export default TableRow;
