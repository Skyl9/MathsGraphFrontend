import React from "react";
import { VariableSizeList as List } from 'react-window';
import TableRow from "./TableRow";
import { AllNodeData } from "../type";
import "./AdminPanel.css"; // Ajoute les styles ici


interface TableProps {
    data: AllNodeData[];
    editData: { [key: number]: Partial<AllNodeData> };
    handleEdit: (id: number, field: keyof AllNodeData, value: string) => void;
    saveChanges: (id: number) => void;
    handleSort: (column: keyof AllNodeData) => void;
    sortColumn: keyof AllNodeData | null;
    sortOrder: "asc" | "desc";
}

export default function Table({ data, editData, handleEdit, saveChanges, handleSort,sortOrder,sortColumn }: TableProps) {
    const getRowHeight = (index: number) => {
        return 100 + (data[index].enonce.length / 25) * 20; // Ajuste selon la longueur du texte
    };

    return (
        <div className="table-container">
            {/* ✅ En-tête fixe */}
            <div className="table-header">
                <div className="table-row">
                    <div className="cell" onClick={() => handleSort("id") }>ID {sortColumn === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("nom") }>Nom {sortColumn === "nom" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("type") }>Type {sortColumn === "type" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("enonce") }>Énoncé {sortColumn === "enonce" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("categorie") }>Catégorie {sortColumn === "categorie" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("mathematicien") }>Mathématicien {sortColumn === "mathematicien" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell" onClick={() => handleSort("demonstration") }>Démonstration {sortColumn === "demonstration" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</div>
                    <div className="cell">Actions</div>
                </div>
            </div>

            {/* ✅ Liste virtualisée */}
            <div className="table-body">
                <List height={600}
                      width={"100%"}
                      itemSize={getRowHeight}
                      itemCount={data.length}>
                    {({ index, style }) => (
                        <TableRow
                            key={data[index].id}
                            node={data[index]}
                            handleEdit={handleEdit}
                            saveChanges={saveChanges}
                            editData={editData}
                            style={style}
                        />
                    )}
                </List>
            </div>
        </div>
    );
}
